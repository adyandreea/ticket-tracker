package com.andreea.ticket_tracker.services;

import com.andreea.ticket_tracker.dto.request.TicketRequestDTO;
import com.andreea.ticket_tracker.entity.Board;
import com.andreea.ticket_tracker.entity.Project;
import com.andreea.ticket_tracker.entity.Ticket;
import com.andreea.ticket_tracker.entity.User;
import com.andreea.ticket_tracker.repository.BoardRepository;
import com.andreea.ticket_tracker.repository.TicketRepository;
import com.andreea.ticket_tracker.repository.UserRepository;
import com.andreea.ticket_tracker.security.config.ProjectSecurityEvaluator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TicketServiceTest {


    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private BoardRepository boardRepository;

    @Mock
    private ProjectSecurityEvaluator projectSecurity;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TicketService ticketService;

    @Mock
    private EmailService emailService;

    private void mockSecurityContext(String username, boolean isAdmin) {
        Authentication auth = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);
        when(auth.getName()).thenReturn(username);
        when(projectSecurity.isUserAdmin()).thenReturn(isAdmin);
    }

    @Test
    void testCreateTicket(){
        Project project = new Project();
        Board board = new Board();
        board.setId(1L);
        board.setProject(project);

        TicketRequestDTO dto = new TicketRequestDTO();
        dto.setTitle("Test");
        dto.setBoardId(1L);

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> i.getArguments()[0]);

        var result = ticketService.createTicket(dto);

        verify(projectSecurity).validateUserAccess(project);
        assertEquals("Test", result.getTitle());
        verify(ticketRepository).save(any(Ticket.class));
    }

    @Test
    void testGetAllTickets(){
        mockSecurityContext("user1", false);

        Ticket ticket = new Ticket();
        when(ticketRepository.findAllByUser("user1")).thenReturn(List.of(ticket));

        var result = ticketService.getAllTickets();

        assertEquals(1, result.size());
        verify(ticketRepository).findAllByUser("user1");
    }

    @Test
    void testGetTicketById(){
        Project project = new Project();
        Board board = new Board();
        board.setProject(project);
        Ticket ticket = new Ticket();
        ticket.setTitle("Ticket 1");
        ticket.setBoard(board);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        var result = ticketService.getTicket(1L);

        verify(projectSecurity).validateUserAccess(project);
        assertEquals("Ticket 1", result.getTitle());
    }

    @Test
    void testUpdateTicket() {
        Project project = new Project();
        Board board = new Board();
        board.setProject(project);
        Ticket ticket = new Ticket();
        ticket.setBoard(board);

        TicketRequestDTO dto = new TicketRequestDTO();
        dto.setTitle("New title");

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> i.getArguments()[0]);

        ticketService.updateTicket(1L, dto);

        verify(projectSecurity).validateUserAccess(project);
        assertEquals("New title", ticket.getTitle());
    }

    @Test
    void testDeleteTicket() {
        Project project = new Project();
        Board board = new Board();
        board.setProject(project);
        Ticket ticket = new Ticket();
        ticket.setBoard(board);

        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        ticketService.deleteTicket(1L);

        verify(projectSecurity).validateUserAccess(project);
        verify(ticketRepository).deleteById(1L);
    }

    @Test
    void testGetTicketsByBoardId_AsUser(){
        mockSecurityContext("user1", false);
        Project project = new Project();
        Board board = new Board();
        board.setProject(project);

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board));
        when(ticketRepository.findAllByBoardAndUser(1L, "user1"))
                .thenReturn(List.of(new Ticket()));

        var result = ticketService.getTicketsByBoardId(1L);

        assertEquals(1, result.size());
        verify(ticketRepository).findAllByBoardAndUser(1L, "user1");
    }

    @Test
    void testCreateTicketWithValidAssignedUser(){
        Project project = new Project();
        project.setName("Kanban Project");

        User user = new User();
        user.setId(99L);
        user.setEmail("assignee@test.com");
        project.setUsers(java.util.Set.of(user));

        Board board = new Board();
        board.setId(1L);
        board.setProject(project);

        TicketRequestDTO dto = new TicketRequestDTO();
        dto.setTitle("Ticket");
        dto.setBoardId(1L);
        dto.setAssignedUserId(99L);

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board));
        when(userRepository.findById(99L)).thenReturn(Optional.of(user));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> i.getArguments()[0]);

        var result = ticketService.createTicket(dto);

        verify(projectSecurity).validateUserAccess(project);
        verify(userRepository).findById(99L);

        verify(emailService, times(1)).sendSimpleEmail(
                eq("assignee@test.com"),
                contains("New ticket assigned"),
                anyString()
        );

        assertEquals("Ticket", result.getTitle());
        assertEquals(99L, result.getAssignedUserId());
    }

    @Test
    void testCreateTicketThrowsUserNotInProjectException() {
        Project project = new Project();
        project.setUsers(java.util.Set.of());

        Board board = new Board();
        board.setId(1L);
        board.setProject(project);

        User externalUser = new User();
        externalUser.setId(99L);

        TicketRequestDTO dto = new TicketRequestDTO();
        dto.setTitle("Test Fail Assign");
        dto.setBoardId(1L);
        dto.setAssignedUserId(99L);

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board));
        when(userRepository.findById(99L)).thenReturn(Optional.of(externalUser));

        org.junit.jupiter.api.Assertions.assertThrows(
                com.andreea.ticket_tracker.exceptions.UserNotInProjectException.class,
                () -> ticketService.createTicket(dto)
        );

        verify(ticketRepository, never()).save(any(Ticket.class));
    }

    @Test
    void testSearchTickets_AsAdmin() {
        mockSecurityContext("admin", true);
        Ticket ticket = new Ticket();
        ticket.setTitle("Bug: Login failing");

        when(ticketRepository.findByTitleContainingIgnoreCase("Bug"))
                .thenReturn(List.of(ticket));

        var result = ticketService.searchTickets("Bug");

        assertEquals(1, result.size());
        assertEquals("Bug: Login failing", result.get(0).getTitle());

        verify(ticketRepository).findByTitleContainingIgnoreCase("Bug");
        verify(ticketRepository, never()).searchByTitleAndUser(anyString(), anyString());
    }

    @Test
    void testSearchTickets_AsUser() {
        mockSecurityContext("user1", false);
        Ticket ticket = new Ticket();
        ticket.setTitle("Fix UI header");

        when(ticketRepository.searchByTitleAndUser("UI", "user1"))
                .thenReturn(List.of(ticket));

        var result = ticketService.searchTickets("UI");

        assertEquals(1, result.size());
        assertEquals("Fix UI header", result.get(0).getTitle());

        verify(ticketRepository).searchByTitleAndUser("UI", "user1");
        verify(ticketRepository, never()).findByTitleContainingIgnoreCase(anyString());
    }
}
