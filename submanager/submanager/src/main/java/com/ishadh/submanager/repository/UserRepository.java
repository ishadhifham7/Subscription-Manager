package com.ishadh.submanager.repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.ishadh.submanager.model.User;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private static final String COLLECTION = "users";

    private final Firestore firestore;

    public UserRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    public Optional<User> findByUid(String uid) throws Exception {
        DocumentSnapshot snapshot = firestore.collection(COLLECTION).document(uid).get().get();

        if (!snapshot.exists()) {
            return Optional.empty();
        }

        return Optional.ofNullable(snapshot.toObject(User.class));
    }

    public User save(User user) throws Exception {
        firestore.collection(COLLECTION)
            .document(user.getUid())
            .set(user)
            .get();

        return user;
    }
}
