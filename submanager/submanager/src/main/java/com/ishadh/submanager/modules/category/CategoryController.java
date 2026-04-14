package com.ishadh.submanager.modules.category;

import com.ishadh.submanager.security.FirebaseAuthFilter;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService service;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CategoryRequest request,
            HttpServletRequest servletRequest
    ) throws Exception {

        String uid = requireUid(servletRequest);
        return ResponseEntity.ok(service.createCategory(request, uid));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories(
            HttpServletRequest servletRequest
    )
            throws Exception {

        String uid = requireUid(servletRequest);
        return ResponseEntity.ok(service.getAllCategories(uid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable String id,
            HttpServletRequest servletRequest
    ) throws Exception {

        String uid = requireUid(servletRequest);
        boolean deleted = service.deleteCategory(id, uid);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Category deleted successfully");
    }

    private String requireUid(HttpServletRequest request) {
        Object uidAttr = request.getAttribute(FirebaseAuthFilter.ATTR_UID);
        if (uidAttr == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return uidAttr.toString();
    }
}
