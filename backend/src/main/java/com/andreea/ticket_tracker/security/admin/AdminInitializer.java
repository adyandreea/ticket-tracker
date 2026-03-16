package com.andreea.ticket_tracker.security.admin;

import com.andreea.ticket_tracker.entity.User;
import com.andreea.ticket_tracker.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import static com.andreea.ticket_tracker.entity.Role.ADMIN;

/**
 * Component that initializes a default admin user on application startup.
 */
@Slf4j
@Component
public class AdminInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProperties adminProperties;

    public AdminInitializer(UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            AdminProperties adminProperties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminProperties = adminProperties;
    }

    /**
     * Creates an admin user if one does not already exist in the database.
     * @param args args command line arguments
     */
    @Override
    public void run(String... args) {

        boolean exists = userRepository.existsByUsername("admin");

        if (!exists) {
            User admin = new User();
            admin.setFirstname("admin");
            admin.setLastname("admin");
            admin.setUsername("admin");
            admin.setEmail(adminProperties.getEmail());
            admin.setPassword(passwordEncoder.encode(adminProperties.getPassword()));
            admin.setRole(ADMIN);

            userRepository.save(admin);

            log.info("Admin has been successfully created!");
        } else {
            log.info("Admin user already exists.");
        }
    }
}
