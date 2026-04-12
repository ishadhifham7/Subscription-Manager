package com.ishadh.submanager.modules.subscription;

public class SubscriptionMapper {

    public static Subscription toEntity(SubscriptionRequest request) {

        Subscription sub = new Subscription();

        sub.setName(request.getName());
        sub.setDescription(request.getDescription());
        sub.setPrice(request.getPrice());
        sub.setCurrency(request.getCurrency());
        sub.setBillingCycle(request.getBillingCycle()); // ✅ ENUM
        sub.setCategoryId(request.getCategoryId());
        sub.setReminderDaysBefore(request.getReminderDaysBefore());

        sub.setActive(true);

        long now = System.currentTimeMillis();
        sub.setStartDate(now);
        sub.setCreatedAt(now);
        sub.setUpdatedAt(now);

        return sub;
    }

    public static SubscriptionResponse toResponse(Subscription sub) {

        SubscriptionResponse res = new SubscriptionResponse();

        res.setId(sub.getId());
        res.setName(sub.getName());
        res.setDescription(sub.getDescription());
        res.setPrice(sub.getPrice());
        res.setCurrency(sub.getCurrency());
        res.setBillingCycle(sub.getBillingCycle()); // ✅ ENUM
        res.setCategoryId(sub.getCategoryId());
        res.setReminderDaysBefore(sub.getReminderDaysBefore());

        res.setActive(sub.getActive());
        res.setStartDate(sub.getStartDate());
        res.setNextBillingDate(sub.getNextBillingDate());
        res.setCreatedAt(sub.getCreatedAt());
        res.setUpdatedAt(sub.getUpdatedAt());

        return res;
    }
}