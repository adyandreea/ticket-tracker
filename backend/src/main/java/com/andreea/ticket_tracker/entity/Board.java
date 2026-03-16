package com.andreea.ticket_tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Board entity for the Kanban board.
 */
@Getter
@Setter
@Entity
@Table(name="boards")
public class Board extends BaseEntity {

    /**
     * The name of the board.
     * It is required and must be between 1 and 64 characters long.
     */
    @NotBlank(message = "name_required")
    @Size(max = 64, min = 1, message = "name_length_invalid")
    private String name;

    /**
     * Description of the board.
     */
    @Size(max = 255, message = "description_too_long")
    private String description;

    /**
     * Parent project of this board.
     */
    @ManyToOne
    @JoinColumn(name = "project_id")
    @NotNull(message = "project_id_required")
    private Project project;

    /**
     * The tickets belonging to this board.
     */
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ticket> tickets;
}
