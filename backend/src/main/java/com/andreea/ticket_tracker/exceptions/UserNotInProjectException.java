package com.andreea.ticket_tracker.exceptions;

/**
 * Exception thrown when a user is not assigned to a specific project.
 */
public class UserNotInProjectException extends RuntimeException {

    /**
     * Initializes the exception with the "user_is_not_in_project" error key.
     */
    public UserNotInProjectException(){
        super("user_is_not_in_project");
    }
}
