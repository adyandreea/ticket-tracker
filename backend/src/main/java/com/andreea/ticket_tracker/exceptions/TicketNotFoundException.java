package com.andreea.ticket_tracker.exceptions;

/**
 * Exception thrown when a requested ticket cannot be found in the database.
 */
public class TicketNotFoundException extends RuntimeException{

    /**
     * Initializes the exception with the "ticket_not_found" error key.
     */
    public TicketNotFoundException(){
        super("ticket_not_found");
    }
}
