package com.vasilevviktor03.betierlist.controllers;

import com.vasilevviktor03.betierlist.models.Post;
import com.vasilevviktor03.betierlist.models.Profile;
import com.vasilevviktor03.betierlist.repository.ProfileRepository;
import com.vasilevviktor03.betierlist.services.PostService;
import com.vasilevviktor03.betierlist.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final ProfileRepository profileRepository;
    private final PostService postService;

    // eventually delete
    @GetMapping("/")
    public String hello(Authentication auth) {
        return "Hi " + auth.getName();
    }

    @GetMapping("/posts")
    public List<Post> getPosts(Authentication auth) {
        return userService.loadUserByUsername(auth.getName()).getProfile().getPosts();
    }

    @PostMapping("/posts")
    public void addPost(Authentication auth, @RequestParam("my-file") MultipartFile file) throws IOException {
        Profile currProfile = userService.loadUserByUsername(auth.getName()).getProfile();
        Post newPost = postService.uploadImage(file, currProfile);
        currProfile.getPosts().add(newPost);
        profileRepository.save(currProfile);
    }
}
