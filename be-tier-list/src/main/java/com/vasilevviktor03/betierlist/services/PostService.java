package com.vasilevviktor03.betierlist.services;

import com.vasilevviktor03.betierlist.models.Post;
import com.vasilevviktor03.betierlist.models.Profile;
import com.vasilevviktor03.betierlist.repository.PostRepository;
import com.vasilevviktor03.betierlist.utils.ImageUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.zip.DataFormatException;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Post uploadImage(MultipartFile file, Profile profile) throws IOException {
        return postRepository.save(new Post(0, profile, ImageUtil.compressImage(file.getBytes())));
    }

    public Post getPostById(int id) {
        return postRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    @Transactional
    public byte[] getImage(Post post) throws DataFormatException, IOException {
        return ImageUtil.decompressImage(post.getImage());
    }
}
