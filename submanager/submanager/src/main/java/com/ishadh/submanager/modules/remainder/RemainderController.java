package com.ishadh.submanager.modules.remainder;

import com.ishadh.submanager.security.CurrentUserResolver;
import com.ishadh.submanager.security.CurrentUserResolver.ResolvedUser;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/remainders")
public class RemainderController {

    private static final Logger log = LoggerFactory.getLogger(RemainderController.class);

    @Autowired
    private RemainderService remainderService;

    @Autowired
    private CurrentUserResolver currentUserResolver;

    @GetMapping
    public ResponseEntity<List<RemainderResponse>> getAllRemainders() throws Exception {
        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/remainders method=GET jwtPresent={} resolvedUserId={} authStatus={}", resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");
        return ResponseEntity.ok(remainderService.getAllRemainders(resolvedUser.userId()));
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Integer>> runSyncNow() throws Exception {
        ResolvedUser resolvedUser = currentUserResolver.resolveCurrentUser();
        log.debug("endpoint=/api/remainders/sync method=POST jwtPresent={} resolvedUserId={} authStatus={}", resolvedUser.fromJwt(), resolvedUser.userId(), resolvedUser.fromJwt() ? "authenticated" : "fallback");
        int created = remainderService.syncRemainders(resolvedUser.userId());
        return ResponseEntity.ok(Map.of("created", created));
    }
}
