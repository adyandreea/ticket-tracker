package com.andreea.ticket_tracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Project entity for the Kanban board.
 */
@Getter
@Setter
@Entity
@Table(name="projects")
public class Project extends BaseEntity{

    /**
     * The name of the project.
     * It is required and must be between 1 and 64 characters long.
     */
    @NotBlank(message = "name_required")
    @Size(max = 64, min = 1, message = "name_length_invalid")
    private String name;

    /**
     * Description of the project.
     */
    @Size(max = 255, message = "description_too_long")
    private String description;

    /**
     * The boards belonging to this project.
     */
    @OneToMany(mappedBy="project", cascade=CascadeType.ALL, orphanRemoval=true)
    private List<Board> boards;

    /**
     * Members assigned to this project.
     */
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "project_members",
               joinColumns = @JoinColumn(name = "project_id"),
               inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> users = new HashSet<>();

    /**
     * Adds a user to the project.
     * @param user the user to add
     */
    public void addUser(User user) {
        this.users.add(user);
        user.getProjects().add(this);
    }

    /**
     * Removes a user from the project.
     * @param user the user to remove
     */
    public void removeUser(User user) {
        this.users.remove(user);
        user.getProjects().remove(this);
    }
}
