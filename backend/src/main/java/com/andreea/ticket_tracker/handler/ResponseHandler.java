package com.andreea.ticket_tracker.handler;

import com.andreea.ticket_tracker.dto.response.SuccessDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Utility class for creating standardized HTTP responses for success messages.
 */
public class ResponseHandler {

    /**
     * Private constructor to prevent instantiation.
     */
    private ResponseHandler(){}

    /**
     * Returns a 201 Created response.
     *
     * @param message the success message
     * @return ResponseEntity containing SuccessDTO and HTTP 201 status
     */
    public static ResponseEntity<SuccessDTO> created(String message){
        return new ResponseEntity<>(SuccessDTO.returnNewDTO(HttpStatus.CREATED.value(),message),HttpStatus.CREATED);
    }

    /**
     * Returns a 200 OK response for update operations.
     *
     * @param message the success message
     * @return ResponseEntity containing SuccessDTO and HTTP 200 status
     */
    public static ResponseEntity<SuccessDTO> updated(String message){
        return new ResponseEntity<>(SuccessDTO.returnNewDTO(HttpStatus.OK.value(),message),HttpStatus.OK);
    }

    /**
     * Returns a 200 OK response for delete operations.
     *
     * @param message the success message
     * @return ResponseEntity containing SuccessDTO and HTTP 200 status
     */
    public static ResponseEntity<SuccessDTO> deleted(String message){
        return new ResponseEntity<>(SuccessDTO.returnNewDTO(HttpStatus.OK.value(),message),HttpStatus.OK);
    }

    /**
     * Returns a general 200 OK success response.
     *
     * @param message the success message
     * @return ResponseEntity containing SuccessDTO and HTTP 200 status
     */
    public static ResponseEntity<SuccessDTO> success(String message){
        return new ResponseEntity<>(SuccessDTO.returnNewDTO(HttpStatus.OK.value(),message),HttpStatus.OK);
    }
}
