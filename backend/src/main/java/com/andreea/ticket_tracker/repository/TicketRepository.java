package com.andreea.ticket_tracker.repository;

import com.andreea.ticket_tracker.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByBoardId(Long boardId);

    @Query("SELECT t FROM Ticket t " +
            "JOIN t.board b " +
            "JOIN b.project p " +
            "JOIN p.users u " +
            "WHERE u.username = :username")
    List<Ticket> findAllByUser(String username);

    @Query("SELECT t FROM Ticket t " +
            "JOIN t.board b " +
            "JOIN b.project p " +
            "JOIN p.users u " +
            "WHERE b.id = :boardId AND u.username = :username")
    List<Ticket> findAllByBoardAndUser(Long boardId, String username);

    List<Ticket> findByTitleContainingIgnoreCase(String title);
    @Query("SELECT DISTINCT t FROM Ticket t " +
            "JOIN t.board b " +
            "JOIN b.project p " +
            "JOIN p.users u " +
            "WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "AND u.username = :username")
    List<Ticket> searchByTitleAndUser(String query, String username);

}
