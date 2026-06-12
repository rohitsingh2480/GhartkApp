package com.ghartk.security;

import com.ghartk.entity.User;
import com.ghartk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrPhone) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(emailOrPhone)
                .or(() -> userRepository.findByPhone(emailOrPhone))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + emailOrPhone));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail() != null ? user.getEmail() : user.getPhone(),
                user.getPasswordHash(), user.isActive(), true, true, true,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    public User loadUserEntityByEmailOrPhone(String emailOrPhone) {
        return userRepository.findByEmail(emailOrPhone)
                .or(() -> userRepository.findByPhone(emailOrPhone))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + emailOrPhone));
    }
}
