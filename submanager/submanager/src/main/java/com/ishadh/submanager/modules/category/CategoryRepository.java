package com.ishadh.submanager.modules.category;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class CategoryRepository {

    private static final String COLLECTION = "categories";

    @Autowired
    private Firestore firestore;

    public Category save(Category category) throws Exception {

        if (category.getId() == null) {
            category.setId(UUID.randomUUID().toString());
        }

        firestore.collection(COLLECTION)
                .document(category.getId())
                .set(category)
                .get();

        return category;
    }

    public List<Category> findAll() throws Exception {

        List<Category> list = new ArrayList<>();

        ApiFuture<QuerySnapshot> future =
                firestore.collection(COLLECTION).get();

        for (DocumentSnapshot doc : future.get().getDocuments()) {
            Category category = doc.toObject(Category.class);
            list.add(category);
        }

        return list;
    }

    public void deleteById(String id) throws Exception {

        firestore.collection(COLLECTION)
                .document(id)
                .delete()
                .get();
    }
}
