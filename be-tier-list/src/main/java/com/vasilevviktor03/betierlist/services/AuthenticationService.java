package com.vasilevviktor03.betierlist.services;

import com.vasilevviktor03.betierlist.models.ApplicationUser;
import com.vasilevviktor03.betierlist.models.Role;
import com.vasilevviktor03.betierlist.models.dtos.LoginResponseDTO;
import com.vasilevviktor03.betierlist.repository.RoleRepository;
import com.vasilevviktor03.betierlist.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final TokenService tokenService;
    private final JavaMailSender mailSender;

    public String registerUser(String username, String password, String siteUrl) {
        String encodedPassword = passwordEncoder.encode(password);
        String randomCode = new Random()
                .ints(48, 123)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(64)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        Role userRole = roleRepository.findByAuthority("USER").get();
        Set<Role> authorities = new HashSet<>();
        authorities.add(userRole);

        ApplicationUser newUser = new ApplicationUser(0, username, encodedPassword, authorities, randomCode, false);
        userRepository.save(newUser);
        try {
            sendVerificationEmail(newUser, siteUrl);
        } catch (Exception e) {
            return "verification email not sent";
        }

        return "registered new user successfully";
    }

    public LoginResponseDTO loginUser(String username, String password) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            String token = tokenService.generateJwt(auth);
            return new LoginResponseDTO(token);
        }
        catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    private void sendVerificationEmail(ApplicationUser user, String siteUrl) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getUsername();
        String fromAddress = "betierlistalpha@gmail.com";
        String senderName = "BeTierList";
        String subject = "Verify your BeTierList account";
        String content = "Dear [[name]],<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + "BeTierList.";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getUsername());
        String verifyURL = siteUrl + "/auth/verify?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);

        mailSender.send(message);
    }

    public boolean verify(String verificationCode) {
        ApplicationUser user = userRepository.findByVerificationCode(verificationCode).orElse(null);
        if (user == null || user.isEnabled()) return true;

        user.setVerificationCode(null);
        user.setEnabled(true);
        userRepository.save(user);
        return true;
    }
}
