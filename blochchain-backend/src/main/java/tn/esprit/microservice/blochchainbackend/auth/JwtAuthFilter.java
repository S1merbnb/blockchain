package tn.esprit.microservice.blochchainbackend.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Simple JWT authentication filter that reads the Authorization header,
 * validates the token with the same secret used by the login endpoint,
 * and sets the SecurityContext if valid.
 *
 * NOTE: This is a minimal implementation for the demo app. In production
 * use a well-tested JWT library and manage secrets securely.
 */
public class JwtAuthFilter extends OncePerRequestFilter {

    // Keep in sync with UserController.JWT_SECRET
    private static final String JWT_SECRET = "9f2c7a4b3d8e6f1a5c2b9d0e4f7a6b8c1d3e5f7091a2b4c6d8e0f1234567890a";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                Claims claims = Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(token).getBody();
                String subject = claims.getSubject();
                String role = claims.get("role", String.class);
                if (subject != null) {
                    SimpleGrantedAuthority authority = role != null ? new SimpleGrantedAuthority("ROLE_" + role) : new SimpleGrantedAuthority("ROLE_USER");
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(subject, null, Collections.singletonList(authority));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                // invalid token - clear context and continue; security will reject if endpoint requires authentication
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }
}
