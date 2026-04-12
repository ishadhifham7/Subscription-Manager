package com.ishadh.submanager.modules.category;

public class CategoryMapper {

    public static Category toEntity(CategoryRequest request) {

        Category category = new Category();

        category.setName(request.getName());
        category.setColor(request.getColor());
        category.setIcon(request.getIcon());

        long now = System.currentTimeMillis();
        category.setCreatedAt(now);
        category.setUpdatedAt(now);

        return category;
    }

    public static CategoryResponse toResponse(Category category) {

        CategoryResponse res = new CategoryResponse();

        res.setId(category.getId());
        res.setName(category.getName());
        res.setColor(category.getColor());
        res.setIcon(category.getIcon());
        res.setCreatedAt(category.getCreatedAt());
        res.setUpdatedAt(category.getUpdatedAt());

        return res;
    }
}
