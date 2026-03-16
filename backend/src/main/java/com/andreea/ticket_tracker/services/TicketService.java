package com.andreea.ticket_tracker.services;

import com.andreea.ticket_tracker.dto.request.TicketRequestDTO;
import com.andreea.ticket_tracker.dto.response.TicketResponseDTO;
import com.andreea.ticket_tracker.entity.Board;
import com.andreea.ticket_tracker.entity.Project;
import com.andreea.ticket_tracker.entity.Ticket;
import com.andreea.ticket_tracker.entity.User;
import com.andreea.ticket_tracker.exceptions.BoardNotFoundException;
import com.andreea.ticket_tracker.exceptions.TicketNotFoundException;
import com.andreea.ticket_tracker.exceptions.UserNotFoundException;
import com.andreea.ticket_tracker.exceptions.UserNotInProjectException;
import com.andreea.ticket_tracker.mapper.TicketDTOMapper;
import com.andreea.ticket_tracker.repository.BoardRepository;
import com.andreea.ticket_tracker.repository.TicketRepository;
import com.andreea.ticket_tracker.repository.UserRepository;
import com.andreea.ticket_tracker.security.config.ProjectSecurityEvaluator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class that handles all business logic for Tickets.
 */
@Service
@Slf4j
public class TicketService {

    private final TicketRepository ticketRepository;
    private final BoardRepository boardRepository;
    private final ProjectSecurityEvaluator projectSecurity;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Autowired
    public TicketService(TicketRepository ticketRepository, BoardRepository boardRepository, ProjectSecurityEvaluator projectSecurity, UserRepository userRepository, EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.boardRepository = boardRepository;
        this.projectSecurity = projectSecurity;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    /**
     * Creates a new ticket and saves it to the database.
     * @param dto the ticket data from the request
     * @return the created ticket as a response DTO
     */
    public TicketResponseDTO createTicket(TicketRequestDTO dto){
        Board board = boardRepository.findById(dto.getBoardId())
                .orElseThrow(BoardNotFoundException::new);

        projectSecurity.validateUserAccess(board.getProject());
        Ticket ticket = TicketDTOMapper.toEntity(dto, board);
        assignUserToTicketIfValid(ticket, dto.getAssignedUserId(), board.getProject());
        Ticket savedTicket = ticketRepository.save(ticket);
        return TicketDTOMapper.toDTO(savedTicket);
    }

    /**
     * Retrieves all tickets.
     * @return a list of tickets accessible to the user
     */
    public List<TicketResponseDTO> getAllTickets(){
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();

        List<Ticket> tickets = projectSecurity.isUserAdmin()
                ? ticketRepository.findAll()
                : ticketRepository.findAllByUser(username);

        return tickets.stream().map(TicketDTOMapper::toDTO).toList();
    }

    /**
     * Finds a specific ticket by ID
     * @param id the ID of the ticket
     * @return the ticket details as a DTO
     */
    public TicketResponseDTO getTicket(Long id){
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(TicketNotFoundException::new);

        projectSecurity.validateUserAccess(ticket.getBoard().getProject());
        return TicketDTOMapper.toDTO(ticket);
    }

    /**
     * Updates ticket details.
     * @param id the ID of the ticket to update
     * @param dto the new ticket data
     * @return the updated ticket details
     */
    public TicketResponseDTO updateTicket(Long id, TicketRequestDTO dto){
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(TicketNotFoundException::new);

        projectSecurity.validateUserAccess(ticket.getBoard().getProject());

        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setPosition(dto.getPosition());

        if (dto.getStoryPoints() != null) {
            ticket.setStoryPoints(dto.getStoryPoints());
        }

        if (dto.getStatus() != null) {
            ticket.setStatus(dto.getStatus());
        }

        Board board = ticket.getBoard();
        if(dto.getBoardId() != null){
            board = boardRepository.findById(dto.getBoardId())
                    .orElseThrow(BoardNotFoundException::new);

            projectSecurity.validateUserAccess(board.getProject());
            ticket.setBoard(board);
        }

        assignUserToTicketIfValid(ticket, dto.getAssignedUserId(), board.getProject());
        Ticket savedTicket = ticketRepository.save(ticket);
        return TicketDTOMapper.toDTO(savedTicket);
    }

    /**
     * Deletes a ticket from the database.
     * @param id the ID of the ticket to remove
     */
    public void deleteTicket(Long id){
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(TicketNotFoundException::new);

        projectSecurity.validateUserAccess(ticket.getBoard().getProject());
        ticketRepository.deleteById(id);
    }

    /**
     * Lists all tickets belonging to a specific board.
     * @param boardId the ID of the board
     * @return a list of boards associated with the board
     */
    public List<TicketResponseDTO> getTicketsByBoardId(Long boardId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        boardRepository.findById(boardId)
                .orElseThrow(BoardNotFoundException::new);

        List<Ticket> tickets;
        if (projectSecurity.isUserAdmin()) {
            tickets = ticketRepository.findByBoardId(boardId);
        } else {
            tickets = ticketRepository.findAllByBoardAndUser(boardId, username);
        }

        return tickets.stream().map(TicketDTOMapper::toDTO).toList();
    }

    /**
     * Validates and assigns a user to a ticket, ensuring they belong to the project.
     * Sends an email notification if a new user is assigned.
     * @param ticket the ticket to update
     * @param assignedUserId the ID of the user to assign
     * @param project the project context for validation
     */
    private void assignUserToTicketIfValid(Ticket ticket, Long assignedUserId, Project project) {
        if (assignedUserId != null) {

            Long currentAssigneeId = ticket.getAssignedUser() != null ? ticket.getAssignedUser().getId() : null;
            boolean isNewAssignment = !assignedUserId.equals(currentAssigneeId);

            User assignee = userRepository.findById(assignedUserId)
                    .orElseThrow(UserNotFoundException::new);

            boolean isUserInProject = project.getUsers().stream()
                    .anyMatch(u -> u.getId().equals(assignedUserId));

            if (!isUserInProject) {
                throw new UserNotInProjectException();
            }

            ticket.setAssignedUser(assignee);

            if (isNewAssignment) {
            String subject = "New ticket assigned: " + ticket.getTitle();
            String body = "Hello,\n\n" +
                    "You have been assigned to the ticket \"" + ticket.getTitle() + "\" " +
                    "in the project \"" + project.getName() + "\".\n" +
                    "Enter the Kanban Board app to see the details and tasks.\n\n";

                try {
                    emailService.sendSimpleEmail(assignee.getEmail(), subject, body);
                } catch (Exception e) {
                    log.error("Error sending email to {}: {}", assignee.getEmail(), e.getMessage());
                }
            }
        } else {
            ticket.setAssignedUser(null);
        }
    }

    /**
     * Searches for tickets by title across all accessible projects.
     * @param query the search keyword
     * @return a list of matching tickets the user is allowed to see
     */
    public List<TicketResponseDTO> searchTickets(String query) {
        String username = SecurityContextHolder
                .getContext().getAuthentication().getName();

        List<Ticket> tickets;
        if (projectSecurity.isUserAdmin()) {
            tickets = ticketRepository.findByTitleContainingIgnoreCase(query);
        } else {
            tickets = ticketRepository.searchByTitleAndUser(query, username);
        }

        return tickets.stream()
                .map(TicketDTOMapper::toDTO)
                .toList();
    }
}
