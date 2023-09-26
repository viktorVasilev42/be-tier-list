package com.vasilevviktor03.betierlist.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "profiles")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Profile {
    @Id
    @Column(name = "user_id")
    private int id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private ApplicationUser user;

    @OneToMany(mappedBy = "profile")
    private List<Post> posts;
}
