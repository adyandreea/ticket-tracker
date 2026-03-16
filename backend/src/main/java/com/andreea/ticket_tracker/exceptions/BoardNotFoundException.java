package com.andreea.ticket_tracker.exceptions;

/**
 * Exception thrown when a requested board cannot be found in the database.
 */
public class BoardNotFoundException extends RuntimeException{

    /**
     * Initializes the exception with the "board_not_found" error key.
     */
    public BoardNotFoundException(){
        super("board_not_found");
    }
}
