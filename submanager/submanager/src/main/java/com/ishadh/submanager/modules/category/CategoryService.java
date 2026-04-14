package com.ishadh.submanager.modules.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    public CategoryResponse createCategory(CategoryRequest request, String uid) throws Exception {

        Category category = CategoryMapper.toEntity(request);
        category.setUid(uid);

        Category saved = repository.save(category);

        return CategoryMapper.toResponse(saved);
    }

    public List<CategoryResponse> getAllCategories(String uid) throws Exception {

        return repository.findAllByUid(uid)
                .stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    public boolean deleteCategory(String id, String uid) throws Exception {
        return repository.deleteByIdAndUid(id, uid);
    }
}
