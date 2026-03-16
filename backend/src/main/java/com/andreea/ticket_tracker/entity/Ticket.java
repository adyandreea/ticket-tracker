package com.andreea.ticket_tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Ticket entity for the Kanban board.
 */
@Getter
@Setter
@Entity
@Table(name = "tickets")
public class Ticket extends BaseEntity{

    /**
     * The name of the ticket.
     * It is required and must be between 3 and 50 characters long.
     */
    @NotBlank(message = "title_required")
    @Size(max = 50, min = 3, message = "title_length_invalid")
    private String title;

    /**
     * Description of the ticket.
     */
    @Size(max = 255, message = "description_too_long")
    private String description;

    /**
     * Position of the ticket.
     * It is required.
     */
    @NotNull(message = "position_required")
    @Min(value = 0, message = "position_min_error")
    private Integer position;

    /**
     * Current status of the ticket.
     */
    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    /**
     * Parent board of this ticket.
     */
    @ManyToOne
    @JoinColumn(name="board_id")
    @NotNull(message = "board_id_required")
    private Board board;

    /**
     * Story Points of the ticket.
     */
    @Min(value = 0, message = "story_points_min_error")
    private Integer storyPoints;

    /**
     * Member assigned to this ticket.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;
}
