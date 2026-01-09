package tn.esprit.microservice.blochchainbackend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.blochchainbackend.user.entity.User;
import tn.esprit.microservice.blochchainbackend.user.repository.UserRepo;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServ {

	private final UserRepo userRepo;
	private final PasswordEncoder encoder = new BCryptPasswordEncoder();

	public Optional<User> register(String email, String password, String role) {
		if (email == null || password == null) return Optional.empty();
		if (userRepo.findByEmail(email).isPresent()) return Optional.empty();
		String hash = encoder.encode(password);
		User u = User.builder().email(email).passwordHash(hash).role(role == null ? "USER" : role).build();
		return Optional.of(userRepo.save(u));
	}

	public Optional<User> authenticate(String email, String password) {
		if (email == null || password == null) return Optional.empty();
		return userRepo.findByEmail(email).filter(u -> encoder.matches(password, u.getPasswordHash()));
	}
}
