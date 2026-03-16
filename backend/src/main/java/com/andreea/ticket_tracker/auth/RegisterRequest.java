package com.andreea.ticket_tracker.auth;

import com.andreea.ticket_tracker.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for user registration.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    /**
     * The firstname of the user.
     */
    @NotBlank(message = "firstname_required")
    private String firstname;

    /**
     * The lastname of the user.
     */
    @NotBlank(message = "lastname_required")
    private String lastname;

    /**
     * The username of the user.
     */
    @NotBlank(message = "username_required")
    @Size(min = 3, max = 20, message = "username_length_invalid")
    private String username;

    /**
     * The email of the user.
     */
    @NotBlank(message = "email_required")
    @Email(message = "email_invalid")
    private String email;

    /**
     * The password of the user.
     */
    @NotBlank(message = "password_required")
    @Size(min = 6, message = "password_length_required")
    private String password;

    /**
     * Assigned role for permissions.
     */
    @NotNull(message = "role_required")
    private Role role;
}
