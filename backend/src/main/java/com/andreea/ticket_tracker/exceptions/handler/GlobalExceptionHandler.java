package com.andreea.ticket_tracker.exceptions.handler;

import com.andreea.ticket_tracker.dto.response.ErrorDTO;
import com.andreea.ticket_tracker.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Global interceptor for handling exceptions and converting them into JSON responses.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles cases where a project is missing.
     */
    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<ErrorDTO> handleProjectNotFound(ProjectNotFoundException ex) {
        ErrorDTO error = new ErrorDTO();

        error.setMessage(ex.getMessage());
        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles cases where a board is missing.
     */
    @ExceptionHandler(BoardNotFoundException.class)
    public ResponseEntity<ErrorDTO> handleBoardNotFound(BoardNotFoundException ex){
        ErrorDTO error = new ErrorDTO();

        error.setMessage(ex.getMessage());
        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles cases where a ticket is missing.
     */
    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<ErrorDTO> handleTicketNotFound(TicketNotFoundException ex){
        ErrorDTO error = new ErrorDTO();

        error.setMessage(ex.getMessage());
        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Catches validation errors from @Valid and maps them to custom field error format.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<FieldErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        FieldErrorResponse fieldErrorResponse = new FieldErrorResponse();
        List<CustomFieldError> fieldErrors = new ArrayList<>();

        ex.getAllErrors().forEach(error -> {
            CustomFieldError fieldError = new CustomFieldError();
            fieldError.setField(((FieldError) error).getField());
            fieldError.setMessage(error.getDefaultMessage());
            fieldErrors.add(fieldError);
        });

        fieldErrorResponse.setFieldErrors(fieldErrors);
        return new ResponseEntity<>(fieldErrorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles failed login attempts.
     */
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDTO> handleBadCredentials(BadCredentialsException ex) {
        ErrorDTO error = new ErrorDTO();

        error.setMessage(ex.getMessage());
        error.setStatus(HttpStatus.UNAUTHORIZED.value());
        error.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handles cases where a user account is not found.
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorDTO> handleUserNotFound(UserNotFoundException ex){
        ErrorDTO error = new ErrorDTO();

        error.setMessage(ex.getMessage());
        error.setStatus(HttpStatus.NOT_FOUND.value());
        error.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles logic errors when a user tries to access a project they aren't part of.
     */
    @ExceptionHandler(UserNotInProjectException.class)
    public ResponseEntity<ErrorDTO> handleUserNotInProject(UserNotInProjectException ex){
        ErrorDTO error = new ErrorDTO();

        error.setMessage(ex.getMessage());
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setTimestamp(LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}