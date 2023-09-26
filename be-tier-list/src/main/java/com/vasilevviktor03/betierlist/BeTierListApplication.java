package com.vasilevviktor03.betierlist;

import com.vasilevviktor03.betierlist.models.ApplicationUser;
import com.vasilevviktor03.betierlist.models.Role;
import com.vasilevviktor03.betierlist.repository.ProfileRepository;
import com.vasilevviktor03.betierlist.repository.RoleRepository;
import com.vasilevviktor03.betierlist.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class BeTierListApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeTierListApplication.class, args);
	}

	@Bean
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository, ProfileRepository profileRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (roleRepository.findByAuthority("ADMIN").isPresent()) return;
			Role adminRole = roleRepository.save(new Role("ADMIN"));
			roleRepository.save(new Role("USER"));

			Set<Role> roles = new HashSet<>();
			roles.add(adminRole);

			ApplicationUser admin = new ApplicationUser(1, "admin", passwordEncoder.encode("password"), roles, null, true);
			userRepository.save(admin);
		};
	}
}
