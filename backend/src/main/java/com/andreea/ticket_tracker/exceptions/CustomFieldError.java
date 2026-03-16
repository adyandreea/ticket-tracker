package com.andreea.ticket_tracker.exceptions;

import lombok.Getter;
import lombok.Setter;

/**
 * Validation error on a specific field.
 */
@Getter
@Setter
public class CustomFieldError {

    /**
     * The name of the field that failed validation.
     */
    private String field;

    /**
     * The error message for the validation failure.
     */
    private String message;
}
