package com.ishadh.submanager.service;

import com.ishadh.submanager.model.User;
import com.ishadh.submanager.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getByUid(String uid) throws Exception {
        return userRepository.findByUid(uid)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User createOrFetch(String uid, String email) throws Exception {
        var existing = userRepository.findByUid(uid);
        if (existing.isPresent()) {
            User user = existing.get();

            if (email != null && !email.equals(user.getEmail())) {
                user.setEmail(email);
                return userRepository.save(user);
            }

            return user;
        }

        User user = new User();
        user.setUid(uid);
        user.setEmail(email == null ? "" : email);
        user.setCreatedAt(System.currentTimeMillis());

        return userRepository.save(user);
    }
}
