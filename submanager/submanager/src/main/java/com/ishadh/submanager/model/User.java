package com.ishadh.submanager.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class User {

    @DocumentId
    private String uid;

    private String email;
    private Long createdAt;
}
