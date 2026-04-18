package com.ishadh.submanager.modules.category;

import com.ishadh.submanager.security.CurrentUserResolver;
import com.ishadh.submanager.security.CurrentUserResolver.ResolvedUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private static final Logger log = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private CategoryService service;

    @Autowired
    private CurrentUserResolver currentUserResolver;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody CategoryRequest request
    ) throws Exception {

        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/categories method=POST jwtPresent={} resolvedUserId={} authStatus={}", resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");

        return ResponseEntity.ok(service.createCategory(request, resolvedUser.userId()));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories()
            throws Exception {

        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/categories method=GET jwtPresent={} resolvedUserId={} authStatus={}", resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");

        return ResponseEntity.ok(service.getAllCategories(resolvedUser.userId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable String id
    ) throws Exception {

        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/categories/{} method=DELETE jwtPresent={} resolvedUserId={} authStatus={}", id, resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");

        boolean deleted = service.deleteCategory(id, resolvedUser.userId());
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Category deleted successfully");
    }
}
