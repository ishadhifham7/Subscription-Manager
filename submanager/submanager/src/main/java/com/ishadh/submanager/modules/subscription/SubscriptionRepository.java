package com.ishadh.submanager.modules.subscription;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class SubscriptionRepository {

    private static final String COLLECTION = "subscriptions";

    @Autowired
    private Firestore firestore;

    public Subscription save(Subscription sub) throws Exception {

        if (sub.getId() == null) {
            sub.setId(UUID.randomUUID().toString());
        }

        firestore.collection(COLLECTION)
                .document(sub.getId())
                .set(sub)
                .get();

        return sub;
    }

    public List<Subscription> findAllByUid(String uid) throws Exception {

        List<Subscription> list = new ArrayList<>();

        ApiFuture<QuerySnapshot> future =
            firestore.collection(COLLECTION)
                .whereEqualTo("uid", uid)
                .get();

        for (DocumentSnapshot doc : future.get().getDocuments()) {
            Subscription sub = doc.toObject(Subscription.class);
            list.add(sub);
        }

        return list;
    }

    public boolean deleteByIdAndUid(String id, String uid) throws Exception {

        DocumentReference docRef = firestore.collection(COLLECTION).document(id);
        DocumentSnapshot snapshot = docRef.get().get();

        if (!snapshot.exists()) {
            return false;
        }

        Subscription existing = snapshot.toObject(Subscription.class);
        if (existing == null || !uid.equals(existing.getUid())) {
            return false;
        }

        docRef.delete().get();
        return true;
    }
}