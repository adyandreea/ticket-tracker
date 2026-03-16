package com.andreea.ticket_tracker.exceptions;

/**
 * Exception thrown when a requested user cannot be found in the database.
 */
public class UserNotFoundException extends RuntimeException{

    /**
     * Initializes the exception with the "user_not_found" error key.
     */
    public UserNotFoundException(){
        super("user_not_found");
    }
}
