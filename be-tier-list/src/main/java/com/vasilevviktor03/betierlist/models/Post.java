package com.vasilevviktor03.betierlist.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "posts")
@NoArgsConstructor
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "post_id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private Profile profile;

    @Lob
    @Column(name = "image_data", length=100000)
    private byte[] image;

    @Column(name = "posted_at")
    private Instant postedAt;

    public Post(int id, Profile profile, byte[] image) {
        this.id = id;
        this.profile = profile;
        this.image = image;
        this.postedAt = Instant.now();
    }
}
