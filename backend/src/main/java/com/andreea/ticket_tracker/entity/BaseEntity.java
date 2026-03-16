package com.andreea.ticket_tracker.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

/**
 * Base class for entities.
 */
@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Timestamp for when the record was created.
     */
    private Instant createdAt;

    /**
     * Timestamp for the last update.
     */
    private Instant updatedAt;

    /**
     * Username of the person who created the record.
     */
    private String createdBy;

    /**
     * Username of the person who last updated the record.
     */
    private String updatedBy;

    /**
     * Timestamp for soft delete functionality.
     */
    private Instant deleted;
}
