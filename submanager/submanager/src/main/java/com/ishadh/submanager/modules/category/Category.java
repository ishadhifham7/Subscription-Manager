package com.ishadh.submanager.modules.category;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class Category {

    @DocumentId
    private String id;

    private String name;
    private String color;
    private String icon;

    private Long createdAt;
    private Long updatedAt;
}