package com.vasilevviktor03.betierlist.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LoginResponseDTO {
    private String jwt;
}
