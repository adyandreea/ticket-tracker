package com.andreea.ticket_tracker.auth;

import com.andreea.ticket_tracker.dto.request.UserRequestDTO;
import com.andreea.ticket_tracker.dto.response.UserResponseDTO;
import com.andreea.ticket_tracker.exceptions.UserNotFoundException;
import com.andreea.ticket_tracker.mapper.UserDTOMapper;
import com.andreea.ticket_tracker.security.config.JwtProvider;
import com.andreea.ticket_tracker.entity.User;
import com.andreea.ticket_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for user authentication and profile management.
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDTOMapper userDTOMapper;
    private final UserRepository userRepository;


    /**
     * Registers a new user and generates a JWT token.
     * @param request registration details
     * @return authentication response with token
     */
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);

        var jwtToken = jwtProvider.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    /**
     * Authenticates a user and returns a JWT token.
     * @param request login credentials
     * @return authentication response with token
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var jwtToken = jwtProvider.generateToken(auth);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    /**
     * Retrieves all registered users.
     * @return list of user DTOs
     */
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userDTOMapper::toDTO)
                .toList();
    }

    /**
     * Deletes a user by ID.
     * @param id user ID
     */
    public void deleteUser(Long id) {
        userRepository.findById(id).orElseThrow(UserNotFoundException::new);

        userRepository.deleteById(id);
    }

    /**
     * Updates user profile details.
     * @param id user ID
     * @param request updated data
     * @return updated user DTO
     */
    public UserResponseDTO updateUser(Long id, UserRequestDTO request) {
        var user = userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        User updatedUser = userRepository.save(user);

        return userDTOMapper.toDTO(updatedUser);
    }

    /**
     * Finds a user by their username.
     * @param username the username to search for
     * @return user details
     */
    public UserResponseDTO getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userDTOMapper::toDTO)
                .orElseThrow(UserNotFoundException::new);
    }

    /**
     * Updates the profile picture for a user.
     * @param username the user's username
     * @param base64Image the image data in Base64 format
     */
    public void updateProfilePicture(String username, String base64Image) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(UserNotFoundException::new);
        user.setProfilePicture(base64Image);
        userRepository.save(user);
    }

    /**
     * Removes the profile picture for a user.
     * @param username the user's username
     */
    public void deleteProfilePicture(String username) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(UserNotFoundException::new);

        user.setProfilePicture(null);
        userRepository.save(user);
    }
}
