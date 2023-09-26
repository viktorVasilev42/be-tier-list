package com.vasilevviktor03.betierlist.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RegistrationDTO {
    private String username;
    private String password;
}
