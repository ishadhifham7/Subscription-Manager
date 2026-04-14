package com.ishadh.submanager.modules.remainder;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RemainderRepository {

    private static final String COLLECTION = "remainder";

    @Autowired
    private Firestore firestore;

    public boolean saveIfAbsent(Remainder remainder) throws Exception {
        DocumentReference docRef = firestore.collection(COLLECTION).document(remainder.getId());
        DocumentSnapshot existing = docRef.get().get();

        if (existing.exists()) {
            return false;
        }

        docRef.set(remainder).get();
        return true;
    }

    public List<Remainder> findAllByUid(String uid) throws Exception {
        QuerySnapshot snapshot = firestore.collection(COLLECTION)
            .whereEqualTo("uid", uid)
            .get()
            .get();
        List<Remainder> list = new ArrayList<>();

        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            Remainder remainder = doc.toObject(Remainder.class);
            if (remainder != null) {
                list.add(remainder);
            }
        }

        return list;
    }
}
