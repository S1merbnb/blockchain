package tn.esprit.microservice.blochchainbackend.user.controller;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.microservice.blochchainbackend.user.entity.User;
import tn.esprit.microservice.blochchainbackend.user.entity.UserRole;
import tn.esprit.microservice.blochchainbackend.user.service.UserServ;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

	private final UserServ userServ;

	// Move to secure configuration in production
	private static final String JWT_SECRET = "replace-this-with-a-secure-random-secret";
	private static final long JWT_EXP_MS = 60 * 60 * 1000L; // 1 hour

	public static class RegisterRequest {
		public String email;
		public String password;
		public String role;
	}

	public static class LoginRequest {
		public String email;
		public String password;
	}

	public static class AuthResponse {
		public String token;
		public String email;
		public String role;

		public AuthResponse(String token, String email, String role) {
			this.token = token;
			this.email = email;
			this.role = role;
		}
	}

	public static class UserDto {
		public Long id;
		public String email;
		public String role;
		public boolean blocked;

		public UserDto(User u) {
			this.id = u.getId();
			this.email = u.getEmail();
			this.role = u.getRole() != null ? u.getRole().toString() : null;
			// Entity uses the BLOCK role to indicate blocked users (no separate boolean field).
			this.blocked = u.getRole() == UserRole.BLOCK;
		}
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
		if (req == null || req.email == null || req.password == null) {
			return ResponseEntity.badRequest().body("email and password required");
		}
		var created = userServ.register(req.email, req.password, req.role);
		if (created.isEmpty()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("user already exists or invalid");
		}
		User u = created.get();
		Map<String, Object> body = new HashMap<>();
		body.put("id", u.getId());
		body.put("email", u.getEmail());
		body.put("role", u.getRole());
		return ResponseEntity.status(HttpStatus.CREATED).body(body);
	}

	@GetMapping("/users")
	public ResponseEntity<?> listUsers() {
		List<User> users = userServ.listAll();
		List<UserDto> out = users.stream().map(UserDto::new).collect(Collectors.toList());
		return ResponseEntity.ok(out);
	}
	

	@PutMapping("/users/role")
	public ResponseEntity<?> updateRoleByEmail(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		String role = body.get("role");
		if (email == null || role == null) return ResponseEntity.badRequest().body("email and role required");
		var updated = userServ.updateRoleByEmail(email, role);
		if (updated.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("invalid role or user not found");
		return ResponseEntity.ok(new UserDto(updated.get()));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest req) {
		if (req == null || req.email == null || req.password == null) {
			return ResponseEntity.badRequest().body("email and password required");
		}
		var userOpt = userServ.authenticate(req.email, req.password);
		if (userOpt.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid credentials");
		}
		User u = userOpt.get();

		Date now = new Date();
		Date exp = new Date(now.getTime() + JWT_EXP_MS);
		String jwt = Jwts.builder()
				.setSubject(u.getEmail())
				.claim("role", u.getRole() != null ? u.getRole().toString() : null)
				.setIssuedAt(now)
				.setExpiration(exp)
				.signWith(SignatureAlgorithm.HS256, JWT_SECRET)
				.compact();

		return ResponseEntity.ok(new AuthResponse(jwt, u.getEmail(), u.getRole() != null ? u.getRole().toString() : null));
	}
}
