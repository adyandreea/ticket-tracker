package com.andreea.ticket_tracker.security.config;

import com.andreea.ticket_tracker.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;

import java.security.Key;
import java.util.Date;

import static io.jsonwebtoken.SignatureAlgorithm.HS512;

/**
 * Utility class for generating, parsing, and validating JSON Web Tokens.
 */
@Component
@Slf4j
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    /**
     * Generates a token for a newly registered user.
     * @param user the user entity
     * @return a signed JWT string
     */
    public String generateToken(User user) {
        return createToken(user.getUsername(), user.getRole().name());
    }

    /**
     * Generates a token based on an active Authentication object.
     * @param authentication the authentication object from SecurityContext
     * @return a signed JWT string
     */
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("USER");

        return createToken(username, role);
    }

    /**
     * Builds a signed JWT token with a 48-hour expiration.
     * @param username user identification
     * @param role user permissions
     * @return the generated JWT
     */
    private String createToken(String username, String role) {
        Date currentDate = new Date();
        long JWT_EXPIRATION_TIME = 3600000 * 24 * 2;
        Date expiringDate = new Date(currentDate.getTime() + JWT_EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", role)
                .setIssuedAt(currentDate)
                .setExpiration(expiringDate)
                .signWith(getSigningKey(), HS512)
                .compact();
    }

    /**
     * Extracts the username from a given JWT.
     * @param token the JWT string
     * @return the username contained in the token
     */
    public String getUsernameFromJWT(final String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /**
     * Validates if the token is properly signed and not expired.
     * @param token the JWT string
     * @return true if valid
     */
    public boolean validateToken(final String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            log.info("JWT is valid.");
            return true;
        } catch (Exception e) {
            throw new AuthenticationCredentialsNotFoundException("JWT Token is not valid, it could be because it's expired or incorrect.");
        }
    }

    /**
     * Decodes the secret key and prepares it for HMAC-512 signing.
     * @return the signing key
     */
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}