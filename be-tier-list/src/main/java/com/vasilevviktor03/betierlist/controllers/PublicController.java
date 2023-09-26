package com.vasilevviktor03.betierlist.controllers;

import com.vasilevviktor03.betierlist.models.Post;
import com.vasilevviktor03.betierlist.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PublicController {
    private final PostService postService;

    @GetMapping("/")
    public String hello() {
        return "hello from public!";
    }

    @GetMapping("/getImage/{postId}")
    public ResponseEntity<?> getPostImage(@PathVariable int postId) {
        Post post = postService.getPostById(postId);
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.valueOf("image/jpg"))
                    .body(postService.getImage(post));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
