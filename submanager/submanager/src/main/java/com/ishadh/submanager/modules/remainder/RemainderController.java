package com.ishadh.submanager.modules.remainder;

import com.ishadh.submanager.security.FirebaseAuthFilter;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/remainders")
public class RemainderController {

    @Autowired
    private RemainderService remainderService;

    @GetMapping
    public ResponseEntity<List<RemainderResponse>> getAllRemainders(HttpServletRequest request) throws Exception {
        String uid = requireUid(request);
        return ResponseEntity.ok(remainderService.getAllRemainders(uid));
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Integer>> runSyncNow(HttpServletRequest request) throws Exception {
        String uid = requireUid(request);
        int created = remainderService.syncRemainders(uid);
        return ResponseEntity.ok(Map.of("created", created));
    }

    private String requireUid(HttpServletRequest request) {
        Object uidAttr = request.getAttribute(FirebaseAuthFilter.ATTR_UID);
        if (uidAttr == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return uidAttr.toString();
    }
}
