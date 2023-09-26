package com.vasilevviktor03.betierlist.controllers;

import com.vasilevviktor03.betierlist.models.dtos.LoginResponseDTO;
import com.vasilevviktor03.betierlist.models.dtos.RegistrationDTO;
import com.vasilevviktor03.betierlist.services.AuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public String registerUser(@RequestBody RegistrationDTO body, HttpServletRequest request) throws MessagingException, UnsupportedEncodingException {
        return authenticationService.registerUser(body.getUsername(), body.getPassword(), getSiteUrl(request));
    }

    private String getSiteUrl(HttpServletRequest request) {
        String siteUrl = request.getRequestURL().toString();
        return siteUrl.replace(request.getServletPath(), "");
    }

    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody RegistrationDTO body) {
        return authenticationService.loginUser(body.getUsername(), body.getPassword());
    }

    @GetMapping("/verify")
    public String verifyUser(@Param("code") String code) {
        return (authenticationService.verify(code)) ? "verify_success" : "verify_fail";
    }

}
