package com.andreea.ticket_tracker.security.config;

import com.andreea.ticket_tracker.entity.Project;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.security.access.AccessDeniedException;

/**
 * Evaluates user permissions for project-related actions.
 */
@Component
public class ProjectSecurityEvaluator {

    /**
     * Checks if the current user is an admin or a member of the given project.
     * @param project the project to validate access
     */
    public void validateUserAccess(Project project) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            throw new AccessDeniedException("User is not authenticated");
        }

        String currentUsername = auth.getName();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN") ||
                        a.getAuthority().equals("ROLE_ADMIN"));

        boolean isMember = project.getUsers().stream()
                .anyMatch(u -> u.getUsername().equals(currentUsername));

        if (!isAdmin && !isMember) {
            throw new AccessDeniedException("You do not have permission to access this project.");
        }
    }

    /**
     * Checks if the currently authenticated user has Admin role.
     * @return true if user is admin
     */
    public boolean isUserAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN") ||
                        a.getAuthority().equals("ROLE_ADMIN"));
    }
}