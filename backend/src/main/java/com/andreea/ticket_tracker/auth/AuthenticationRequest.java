package com.andreea.ticket_tracker.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for user authentication.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {

    /**
     * The username of the user.
     */
    @NotBlank(message = "username_required")
    private String username;

    /**
     * The password of the user.
     */
    @NotBlank(message = "password_required")
    private String password;
}
