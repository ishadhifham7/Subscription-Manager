package com.ishadh.submanager.modules.remainder;

import com.ishadh.submanager.modules.subscription.BillingCycle;
import com.ishadh.submanager.modules.subscription.Subscription;
import com.ishadh.submanager.modules.subscription.SubscriptionRepository;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RemainderService {

    private static final long DAY_MS = 24L * 60 * 60 * 1000;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private RemainderRepository remainderRepository;

    @Scheduled(cron = "0 0 * * * *", zone = "UTC")
    public void syncScheduledRemainders() {
        // Scheduler is intentionally disabled for per-user sync because backend is stateless.
    }

    public int syncRemainders(String uid) throws Exception {
        long now = System.currentTimeMillis();
        int createdCount = 0;

        List<Subscription> subscriptions = subscriptionRepository.findAllByUid(uid);

        for (Subscription sub : subscriptions) {
            if (!Boolean.TRUE.equals(sub.getActive()) || sub.getBillingCycle() == null || sub.getNextBillingDate() == null) {
                continue;
            }

            int daysBefore = sub.getReminderDaysBefore() == null ? 3 : sub.getReminderDaysBefore();
            if (daysBefore < 0) {
                daysBefore = 0;
            }

            long nextBillingDate = ensureUpcomingNextBillingDate(sub, now);
            long reminderDate = nextBillingDate - (daysBefore * DAY_MS);

            if (now < reminderDate || now >= nextBillingDate) {
                continue;
            }

            Remainder remainder = buildRemainder(uid, sub, nextBillingDate, reminderDate, daysBefore, now);
            if (remainderRepository.saveIfAbsent(remainder)) {
                createdCount++;
            }
        }

        return createdCount;
    }

    public List<RemainderResponse> getAllRemainders(String uid) throws Exception {
        return remainderRepository.findAllByUid(uid)
            .stream()
            .sorted(Comparator.comparing(Remainder::getReminderDate).reversed())
            .map(RemainderMapper::toResponse)
            .toList();
    }

    private Remainder buildRemainder(
        String uid,
        Subscription sub,
        long nextBillingDate,
        long reminderDate,
        int daysBefore,
        long now
    ) {
        Remainder remainder = new Remainder();
        remainder.setId(buildCycleId(uid, sub.getId(), nextBillingDate));
        remainder.setUid(uid);
        remainder.setSubscriptionId(sub.getId());
        remainder.setSubscriptionName(sub.getName());
        remainder.setNextBillingDate(nextBillingDate);
        remainder.setReminderDate(reminderDate);
        remainder.setBillingCycle(sub.getBillingCycle());
        remainder.setDaysBefore(daysBefore);
        remainder.setCycleRef(String.valueOf(nextBillingDate));
        remainder.setStatus(RemainderStatus.PENDING);
        remainder.setCreatedAt(now);
        return remainder;
    }

    private long ensureUpcomingNextBillingDate(Subscription sub, long now) throws Exception {
        long nextBillingDate = sub.getNextBillingDate();

        if (nextBillingDate > now) {
            return nextBillingDate;
        }

        long rolledForward = nextBillingDate;

        while (rolledForward <= now) {
            rolledForward = addCycle(rolledForward, sub.getBillingCycle());
        }

        sub.setNextBillingDate(rolledForward);
        sub.setUpdatedAt(now);
        subscriptionRepository.save(sub);

        return rolledForward;
    }

    private long addCycle(long millis, BillingCycle cycle) {
        ZonedDateTime base = Instant.ofEpochMilli(millis).atZone(ZoneOffset.UTC);

        ZonedDateTime next = switch (cycle) {
            case WEEKLY -> base.plusWeeks(1);
            case MONTHLY -> base.plusMonths(1);
            case YEARLY -> base.plusYears(1);
        };

        return next.toInstant().toEpochMilli();
    }

    private String buildCycleId(String uid, String subscriptionId, long nextBillingDate) {
        return uid + "_" + subscriptionId + "_" + nextBillingDate;
    }
}
