package com.andreea.ticket_tracker.services;

import com.andreea.ticket_tracker.dto.request.ProjectRequestDTO;
import com.andreea.ticket_tracker.dto.response.ProjectResponseDTO;
import com.andreea.ticket_tracker.dto.response.UserResponseDTO;
import com.andreea.ticket_tracker.entity.Project;
import com.andreea.ticket_tracker.entity.User;
import com.andreea.ticket_tracker.exceptions.ProjectNotFoundException;
import com.andreea.ticket_tracker.exceptions.UserNotFoundException;
import com.andreea.ticket_tracker.mapper.UserDTOMapper;
import com.andreea.ticket_tracker.mapper.ProjectDTOMapper;
import com.andreea.ticket_tracker.repository.ProjectRepository;
import com.andreea.ticket_tracker.repository.UserRepository;
import com.andreea.ticket_tracker.security.config.ProjectSecurityEvaluator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final UserDTOMapper userDTOMapper;
    private final ProjectSecurityEvaluator projectSecurity;
    private final EmailService emailService;


    @Autowired
    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, UserDTOMapper userDTOMapper, ProjectSecurityEvaluator projectSecurity, EmailService emailService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.userDTOMapper = userDTOMapper;
        this.projectSecurity = projectSecurity;
        this.emailService = emailService;
    }

    public ProjectResponseDTO createProject(ProjectRequestDTO dto){
        Project project = ProjectDTOMapper.toEntity(dto);
        Project savedProject = projectRepository.save(project);
        return ProjectDTOMapper.toDTO(savedProject);
    }

    public List<ProjectResponseDTO> getAllProjects(){
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        List<Project> projects = projectSecurity.isUserAdmin()
                ? projectRepository.findAll()
                : projectRepository.findAllByMember(currentUsername);

        return projects.stream()
                .map(ProjectDTOMapper::toDTO)
                .toList();
    }

    public ProjectResponseDTO getProject(Long id){
        Project project = projectRepository.findById(id)
                .orElseThrow(ProjectNotFoundException::new);

        projectSecurity.validateUserAccess(project);

        return ProjectDTOMapper.toDTO(project);
    }

    public ProjectResponseDTO updateProject(Long id, ProjectRequestDTO dto){
        Project project = projectRepository.findById(id)
                .orElseThrow(ProjectNotFoundException::new);

        projectSecurity.validateUserAccess(project);
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());

        Project savedProject = projectRepository.save(project);
        return ProjectDTOMapper.toDTO(savedProject);
    }

    public void deleteProject(Long id){
        Project project = projectRepository.findById(id)
                .orElseThrow(ProjectNotFoundException::new);

        projectSecurity.validateUserAccess(project);
        projectRepository.deleteById(id);
    }

    public void assignUserToProject(Long projectId, Long userId){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);

        projectSecurity.validateUserAccess(project);

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        project.addUser(user);
        projectRepository.save(project);

        String subject = "You have been added to a new project: " + project.getName();
        String body = "Hello,\n\n" +
                "You were assigned to the project \"" + project.getName() + "\".\n" +
                "Enter the Kanban Board app to see the details and tasks.\n\n";

        try {
            emailService.sendSimpleEmail(user.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("Error sending email to " + user.getEmail() + ": " + e.getMessage());
        }
    }

    public List<UserResponseDTO> getProjectMembers(Long projectId){
        Project project = projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);

        projectSecurity.validateUserAccess(project);

        return userRepository.findAllByProjectId(projectId)
                .stream()
                .map(userDTOMapper::toDTO)
                .toList();
    }

    public void removeUserFromProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(ProjectNotFoundException::new);

        projectSecurity.validateUserAccess(project);

        User user = userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        project.removeUser(user);
        projectRepository.save(project);
    }
}
