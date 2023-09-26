package com.vasilevviktor03.betierlist.repository;

import com.vasilevviktor03.betierlist.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer> {
    Optional<Post> findById(int id);
}
