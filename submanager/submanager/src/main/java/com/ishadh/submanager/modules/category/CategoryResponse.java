package com.ishadh.submanager.modules.category;

import lombok.Data;

@Data
public class CategoryResponse {

    private String id;
    private String name;
    private String color;
    private String icon;

    private Long createdAt;
    private Long updatedAt;
}