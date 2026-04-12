package com.ishadh.submanager.modules.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    public CategoryResponse createCategory(CategoryRequest request) throws Exception {

        Category category = CategoryMapper.toEntity(request);

        Category saved = repository.save(category);

        return CategoryMapper.toResponse(saved);
    }

    public List<CategoryResponse> getAllCategories() throws Exception {

        return repository.findAll()
                .stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    public void deleteCategory(String id) throws Exception {
        repository.deleteById(id);
    }
}
