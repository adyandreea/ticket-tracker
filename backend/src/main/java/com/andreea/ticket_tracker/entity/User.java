package com.andreea.ticket_tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.Builder;

import java.util.HashSet;
import java.util.Set;

/**
 * User entity for the Kanban board.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users")
public class User {

        @Id
        @GeneratedValue
        private Long id;

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
        @Size(min = 6, message = "password_length_invalid")
        private String password;

        /**
         * Assigned role for permissions.
         */
        @NotNull(message = "role_required")
        @Enumerated(EnumType.STRING)
        private Role role;

        /**
         * The projects this user is a member of.
         */
        @Builder.Default
        @ManyToMany(mappedBy="users", cascade=CascadeType.ALL)
        private Set<Project> projects = new HashSet<>();

        /**
         * Profile picture stored as a Base64 string or URL.
         */
        @Lob
        @Column(name = "profile_picture", columnDefinition = "LONGTEXT")
        private String profilePicture;
}
