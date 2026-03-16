package com.andreea.ticket_tracker.exceptions;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Response object containing a list of field-level validation errors.
 */
@Getter
@Setter
public class FieldErrorResponse {

    /**
     * The list of field validation errors.
     */
    private List<CustomFieldError> fieldErrors;
}
