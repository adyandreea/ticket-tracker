package com.andreea.ticket_tracker.security.admin;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for the default admin account.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.admin")
public class AdminProperties {

    /**
     * The admin email address.
     */
    private String email;

    /**
     * The admin username.
     */
    private String username;

    /**
     * The admin password.
     */
    private String password;
}
