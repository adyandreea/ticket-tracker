package com.andreea.ticket_tracker.exceptions;

/**
 * Exception thrown when a requested project cannot be found in the database.
 */
public class ProjectNotFoundException extends RuntimeException{

    /**
     * Initializes the exception with the "project_not_found" error key.
     */
    public ProjectNotFoundException(){
        super("project_not_found");
    }
}
