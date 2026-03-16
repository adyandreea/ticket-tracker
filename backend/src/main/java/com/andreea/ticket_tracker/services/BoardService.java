package com.andreea.ticket_tracker.services;

import com.andreea.ticket_tracker.dto.request.BoardRequestDTO;
import com.andreea.ticket_tracker.dto.response.BoardResponseDTO;
import com.andreea.ticket_tracker.entity.Board;
import com.andreea.ticket_tracker.entity.Project;
import com.andreea.ticket_tracker.exceptions.BoardNotFoundException;
import com.andreea.ticket_tracker.exceptions.ProjectNotFoundException;
import com.andreea.ticket_tracker.mapper.BoardDTOMapper;
import com.andreea.ticket_tracker.repository.BoardRepository;
import com.andreea.ticket_tracker.repository.ProjectRepository;
import com.andreea.ticket_tracker.security.config.ProjectSecurityEvaluator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class that handles all business logic for Boards.
 */
@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final ProjectRepository projectRepository;
    private final ProjectSecurityEvaluator projectSecurity;

    @Autowired
    public BoardService(BoardRepository boardRepository, ProjectRepository projectRepository, ProjectSecurityEvaluator projectSecurity) {
        this.boardRepository = boardRepository;
        this.projectRepository = projectRepository;
        this.projectSecurity = projectSecurity;
    }

    /**
     * Creates a new board and saves it to the database.
     * @param dto the board data from the request
     * @return the created board as a response DTO
     */
    public BoardResponseDTO createBoard(BoardRequestDTO dto){
      Project project = projectRepository.findById(dto.getProjectId())
              .orElseThrow(ProjectNotFoundException::new);

      projectSecurity.validateUserAccess(project);
      Board board = BoardDTOMapper.toEntity(dto, project);

      Board savedBoard = boardRepository.save(board);
      return BoardDTOMapper.toDTO(savedBoard);
    }

    /**
     * Retrieves all boards visible to the current user.
     * @return a list of boards
     */
    public List<BoardResponseDTO> getAllBoards() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        List<Board> boards = projectSecurity.isUserAdmin()
                ? boardRepository.findAll()
                : boardRepository.findAllByUser(username);

        return boards.stream().map(BoardDTOMapper::toDTO).toList();
    }

    /**
     * Finds a specific board by ID, verifying if the user has permission to see it.
     * @param id the ID of the board
     * @return the board details as a DTO
     */
    public BoardResponseDTO getBoard(Long id){
        Board board = boardRepository.findById(id)
                .orElseThrow(BoardNotFoundException::new);

        projectSecurity.validateUserAccess(board.getProject());

        return BoardDTOMapper.toDTO(board);
    }

    /**
     * Updates board details.
     * @param id the ID of the board to update
     * @param dto the new board data
     * @return the updated board details
     */
    public BoardResponseDTO updateBoard(Long id, BoardRequestDTO dto){
        Board board = boardRepository.findById(id)
                .orElseThrow(BoardNotFoundException::new);

        projectSecurity.validateUserAccess(board.getProject());

        board.setName(dto.getName());
        board.setDescription(dto.getDescription());

        if(dto.getProjectId() != null){
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(ProjectNotFoundException::new);
            board.setProject(project);
        }

        Board savedBoard = boardRepository.save(board);
        return BoardDTOMapper.toDTO(savedBoard);
    }

    /**
     * Deletes a board from the database.
     * @param id the ID of the board to remove
     */
    public void deleteBoard(Long id){
        Board board = boardRepository.findById(id)
                .orElseThrow(BoardNotFoundException::new);

        projectSecurity.validateUserAccess(board.getProject());
        boardRepository.deleteById(id);
    }

    /**
     * Lists all boards who are in current project.
     * @param projectId the ID of the project
     * @return a list of boards associated with the project
     */
    public List<BoardResponseDTO> getBoardsByProjectId(Long projectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        projectRepository.findById(projectId).orElseThrow(ProjectNotFoundException::new);

        List<Board> boards = projectSecurity.isUserAdmin()
                ? boardRepository.findByProjectId(projectId)
                : boardRepository.findAllByProjectAndUser(projectId, username);

        return boards.stream().map(BoardDTOMapper::toDTO).toList();
    }
}
