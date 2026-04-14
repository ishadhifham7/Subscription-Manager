package com.ishadh.submanager.modules.subscription;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository repository;

    public SubscriptionResponse createSubscription(SubscriptionRequest request, String uid) throws Exception {

        Subscription sub = SubscriptionMapper.toEntity(request);
        sub.setUid(uid);

        long nextBilling = calculateNextBilling(
                sub.getBillingCycle(),
                sub.getStartDate()
        );

        sub.setNextBillingDate(nextBilling);

        Subscription saved = repository.save(sub);

        return SubscriptionMapper.toResponse(saved);
    }

    public List<SubscriptionResponse> getAllSubscriptions(String uid) throws Exception {

        return repository.findAllByUid(uid)
                .stream()
                .map(sub -> SubscriptionMapper.toResponse(sub))
                .toList();
    }

    public boolean deleteSubscription(String id, String uid) throws Exception {
        return repository.deleteByIdAndUid(id, uid);
    }

    // 🔥 ENUM-based logic (clean & safe)
    private long calculateNextBilling(BillingCycle cycle, long startDate) {

        return switch (cycle) {
            case WEEKLY -> startDate + (7L * 24 * 60 * 60 * 1000);
            case MONTHLY -> startDate + (30L * 24 * 60 * 60 * 1000);
            case YEARLY -> startDate + (365L * 24 * 60 * 60 * 1000);
        };
    }
}