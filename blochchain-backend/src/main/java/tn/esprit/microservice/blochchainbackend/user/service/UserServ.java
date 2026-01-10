package tn.esprit.microservice.blochchainbackend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.blochchainbackend.user.entity.User;
import tn.esprit.microservice.blochchainbackend.user.entity.UserRole;
import tn.esprit.microservice.blochchainbackend.user.repository.UserRepo;

import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServ {

	private final UserRepo userRepo;
	private final PasswordEncoder encoder = new BCryptPasswordEncoder();

	public Optional<User> register(String email, String password, String role) {
		if (email == null || password == null) return Optional.empty();
		if (userRepo.findByEmail(email).isPresent()) return Optional.empty();
		UserRole r = UserRole.BLOCK; // default to BLOCK only if parsing fails
		try {
			r = role == null ? UserRole.ADMIN : UserRole.valueOf(role);
		} catch (Exception e) {
			// fallback to USER-equivalent: if your enum doesn't have USER, pick ADMIN as default
			try {
				r = UserRole.valueOf("ADMIN");
			} catch (Exception ex) {
				r = UserRole.BLOCK;
			}
		}
		String hash = encoder.encode(password);
		// The entity does not have a separate "blocked" boolean; use the BLOCK role to mark blocked users.
		User u = User.builder().email(email).passwordHash(hash).role(r).build();
		return Optional.of(userRepo.save(u));
	}

	public Optional<User> authenticate(String email, String password) {
		if (email == null || password == null) return Optional.empty();
		return userRepo.findByEmail(email)
				// only allow login for ADMIN or SUPERADMIN; users with role BLOCK are considered blocked
				.filter(u -> u.getRole() == UserRole.ADMIN || u.getRole() == UserRole.SUPERADMIN)
				.filter(u -> encoder.matches(password, u.getPasswordHash()));
	}

	public List<User> listAll() {
		return userRepo.findAll();
	}



	public Optional<User> updateRoleByEmail(String email, String roleStr) {
		if (email == null) return Optional.empty();
		var opt = userRepo.findByEmail(email);
		if (opt.isEmpty()) return Optional.empty();
		User u = opt.get();
		try {
			UserRole r = UserRole.valueOf(roleStr);
			u.setRole(r);
			return Optional.of(userRepo.save(u));
		} catch (Exception e) {
			return Optional.empty();
		}
	}
}


