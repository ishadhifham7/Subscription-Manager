package com.ishadh.submanager.modules.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private static final String DEFAULT_UID = "local-dev-user";

    @Autowired
    private CategoryService service;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CategoryRequest request
    ) throws Exception {

        return ResponseEntity.ok(service.createCategory(request, DEFAULT_UID));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories()
            throws Exception {

        return ResponseEntity.ok(service.getAllCategories(DEFAULT_UID));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable String id
    ) throws Exception {

        boolean deleted = service.deleteCategory(id, DEFAULT_UID);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Category deleted successfully");
    }
}
