package com.vasilevviktor03.betierlist.repository;

import com.vasilevviktor03.betierlist.models.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<ApplicationUser, Integer> {
    Optional<ApplicationUser> findByUsername(String username);
    Optional<ApplicationUser> findByVerificationCode(String code);
}
