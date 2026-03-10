package com.andreea.ticket_tracker.controllers;

import com.andreea.ticket_tracker.dto.request.TicketRequestDTO;
import com.andreea.ticket_tracker.entity.Board;
import com.andreea.ticket_tracker.entity.Project;
import com.andreea.ticket_tracker.entity.Ticket;
import com.andreea.ticket_tracker.repository.BoardRepository;
import com.andreea.ticket_tracker.repository.ProjectRepository;
import com.andreea.ticket_tracker.repository.TicketRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static com.andreea.ticket_tracker.entity.TicketStatus.DONE;
import static com.andreea.ticket_tracker.entity.TicketStatus.TODO;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void cleanDatabase() {
        ticketRepository.deleteAll();
        boardRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testCreateTicket() throws Exception {

        Project project = new Project();
        project.setName("Project");
        project.setDescription("Desc");
        project = projectRepository.save(project);

        Board board = new Board();
        board.setName("Board");
        board.setDescription("Description");
        board.setProject(project);
        board = boardRepository.save(board);

        TicketRequestDTO dto = new TicketRequestDTO();
        dto.setTitle("Ticket");
        dto.setDescription("Desc");
        dto.setPosition(1);
        dto.setStatus(TODO);
        dto.setBoardId(board.getId());

        mockMvc.perform(post("/api/v1/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(jsonPath("$.title").value("Ticket"))
                .andExpect(jsonPath("$.description").value("Desc"))
                .andExpect(jsonPath("$.position").value(1))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.boardId").value(board.getId()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetAllTickets() throws Exception {

        Project project = new Project();
        project.setName("Project");
        project.setDescription("Desc");
        project = projectRepository.save(project);

        Board board = new Board();
        board.setName("Board");
        board.setDescription("Description");
        board.setProject(project);
        board = boardRepository.save(board);

        Ticket ticket1 = new Ticket();
        ticket1.setTitle("Ticket 1");
        ticket1.setDescription("Desc");
        ticket1.setPosition(1);
        ticket1.setStatus(TODO);
        ticket1.setBoard(board);
        ticketRepository.save(ticket1);

        Ticket ticket2 = new Ticket();
        ticket2.setTitle("Ticket 2");
        ticket2.setDescription("Desc");
        ticket2.setPosition(1);
        ticket2.setStatus(DONE);
        ticket2.setBoard(board);
        ticketRepository.save(ticket2);

        mockMvc.perform(get("/api/v1/tickets")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(2)))
                .andExpect(jsonPath("$[0].title").value("Ticket 1"))
                .andExpect(jsonPath("$[1].title").value("Ticket 2"))
                .andExpect(jsonPath("$[0].boardId").value(board.getId()))
                .andExpect(jsonPath("$[1].boardId").value(board.getId()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testGetTicketById() throws Exception {

        Project project = new Project();
        project.setName("Project");
        project.setDescription("Desc");
        project = projectRepository.save(project);

        Board board = new Board();
        board.setName("Board");
        board.setDescription("Description");
        board.setProject(project);
        board = boardRepository.save(board);

        Ticket ticket = new Ticket();
        ticket.setTitle("Ticket 1");
        ticket.setDescription("Desc");
        ticket.setPosition(1);
        ticket.setStatus(TODO);
        ticket.setBoard(board);
        ticket = ticketRepository.save(ticket);

        Long id = ticket.getId();

        mockMvc.perform(get("/api/v1/tickets/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.title").value("Ticket 1"))
                .andExpect(jsonPath("$.description").value("Desc"))
                .andExpect(jsonPath("$.position").value(1))
                .andExpect(jsonPath("$.status").value("TODO"))
                .andExpect(jsonPath("$.boardId").value(board.getId()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testUpdateTicket() throws Exception {

        Project project = new Project();
        project.setName("Project");
        project.setDescription("Desc");
        project = projectRepository.save(project);

        Board board = new Board();
        board.setName("Board");
        board.setDescription("Description");
        board.setProject(project);
        board = boardRepository.save(board);

        Ticket ticket1 = new Ticket();
        ticket1.setTitle("Old ticket");
        ticket1.setDescription("Old Desc");
        ticket1.setPosition(1);
        ticket1.setStatus(TODO);
        ticket1.setBoard(board);
        ticket1 = ticketRepository.save(ticket1);

        TicketRequestDTO dto = new TicketRequestDTO();
        dto.setTitle("New ticket");
        dto.setDescription("New Desc");
        dto.setPosition(2);
        dto.setStatus(DONE);
        dto.setBoardId(board.getId());

        Long id = ticket1.getId();

        mockMvc.perform(put("/api/v1/tickets/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(jsonPath("$.title").value("New ticket"))
                .andExpect(jsonPath("$.description").value("New Desc"))
                .andExpect(jsonPath("$.position").value(2))
                .andExpect(jsonPath("$.status").value("DONE"))
                .andExpect(jsonPath("$.boardId").value(board.getId()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testDeleteTicket() throws Exception {

        Project project = new Project();
        project.setName("Project");
        project.setDescription("Desc");
        project = projectRepository.save(project);

        Board board = new Board();
        board.setName("Board");
        board.setDescription("Description");
        board.setProject(project);
        board = boardRepository.save(board);

        Ticket ticket = new Ticket();
        ticket.setTitle("Ticket");
        ticket.setDescription("Desc");
        ticket.setPosition(1);
        ticket.setStatus(DONE);
        ticket.setBoard(board);
        ticket = ticketRepository.save(ticket);

        Long id = ticket.getId();

        mockMvc.perform(delete("/api/v1/tickets/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Ticket deleted successfully"));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testTicketNotFound() throws Exception {

        Long invalidId = 999L;

        mockMvc.perform(get("/api/v1/tickets/" + invalidId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("ticket_not_found"))
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testValidationOnCreateTicket() throws Exception {

        TicketRequestDTO dto = new TicketRequestDTO();
        dto.setTitle("");
        dto.setDescription("a".repeat(300));
        dto.setPosition(-1);
        dto.setStatus(null);
        dto.setBoardId(null);

        mockMvc.perform(post("/api/v1/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors").isArray())
                .andExpect(jsonPath("$.fieldErrors", org.hamcrest.Matchers.hasSize(6)))

                .andExpect(jsonPath("$.fieldErrors[?(@.field=='title')].message",
                        org.hamcrest.Matchers.hasItems("title_required", "title_length_invalid")))

                .andExpect(jsonPath("$.fieldErrors[?(@.field=='description')].message",
                        org.hamcrest.Matchers.hasItem("description_too_long")))

                .andExpect(jsonPath("$.fieldErrors[?(@.field=='position')].message",
                        org.hamcrest.Matchers.hasItem("position_min_error")))

                .andExpect(jsonPath("$.fieldErrors[?(@.field=='status')].message",
                        org.hamcrest.Matchers.hasItem("status_required")))

                .andExpect(jsonPath("$.fieldErrors[?(@.field=='boardId')].message",
                        org.hamcrest.Matchers.hasItem("board_id_required")));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void getTicketsByBoardId() throws Exception{

        Project project = new Project();
        project.setName("Project");
        project.setDescription("Desc");
        project = projectRepository.save(project);

        Board board = new Board();
        board.setName("Board 1");
        board.setDescription("Desc");
        board.setProject(project);
        board = boardRepository.save(board);

        Ticket ticket1 = new Ticket();
        ticket1.setTitle("Ticket 1");
        ticket1.setDescription("Desc");
        ticket1.setPosition(1);
        ticket1.setStatus(TODO);
        ticket1.setBoard(board);
        ticketRepository.save(ticket1);

        Ticket ticket2 = new Ticket();
        ticket2.setTitle("Ticket 2");
        ticket2.setDescription("Desc");
        ticket2.setPosition(2);
        ticket2.setStatus(DONE);
        ticket2.setBoard(board);
        ticketRepository.save(ticket2);

        Long id = board.getId();

        mockMvc.perform(get("/api/v1/tickets/by-board/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(2)))
                .andExpect(jsonPath("$[0].title").value("Ticket 1"))
                .andExpect(jsonPath("$[1].title").value("Ticket 2"))
                .andExpect(jsonPath("$[0].boardId").value(id))
                .andExpect(jsonPath("$[1].boardId").value(id));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    void testSearchTickets() throws Exception {
        Project project = new Project();
        project.setName("Project");
        project.setDescription("Project Desc");
        project = projectRepository.save(project);

        Board board = new Board();
        board.setName("Board");
        board.setDescription("Board Desc");
        board.setProject(project);
        board = boardRepository.save(board);

        Ticket ticket1 = new Ticket();
        ticket1.setTitle("Fix the login bug");
        ticket1.setDescription("Desc 1");
        ticket1.setPosition(1);
        ticket1.setStatus(TODO);
        ticket1.setBoard(board);
        ticketRepository.save(ticket1);

        Ticket ticket2 = new Ticket();
        ticket2.setTitle("Update user profile");
        ticket2.setDescription("Desc 2");
        ticket2.setPosition(2);
        ticket2.setStatus(DONE);
        ticket2.setBoard(board);
        ticketRepository.save(ticket2);

        mockMvc.perform(get("/api/v1/tickets/search")
                        .param("query", "logIN")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Fix the login bug"));

        mockMvc.perform(get("/api/v1/tickets/search")
                        .param("query", "xyz123")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.empty()));
    }
}
