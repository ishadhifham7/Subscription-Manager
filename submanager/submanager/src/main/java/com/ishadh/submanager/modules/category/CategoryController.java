package com.ishadh.submanager.modules.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService service;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CategoryRequest request
    ) throws Exception {

        return ResponseEntity.ok(service.createCategory(request));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories()
            throws Exception {

        return ResponseEntity.ok(service.getAllCategories());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable String id)
            throws Exception {

        service.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully");
    }
}
