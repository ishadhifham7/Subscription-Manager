package com.ishadh.submanager.modules.remainder;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/remainders")
public class RemainderController {

    @Autowired
    private RemainderService remainderService;

    @GetMapping
    public ResponseEntity<List<RemainderResponse>> getAllRemainders() throws Exception {
        return ResponseEntity.ok(remainderService.getAllRemainders());
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Integer>> runSyncNow() throws Exception {
        int created = remainderService.syncRemainders();
        return ResponseEntity.ok(Map.of("created", created));
    }
}
