package com.ishadh.submanager.modules.remainder;

public class RemainderMapper {

    private RemainderMapper() {
    }

    public static RemainderResponse toResponse(Remainder remainder) {
        RemainderResponse response = new RemainderResponse();
        response.setId(remainder.getId());
        response.setSubscriptionId(remainder.getSubscriptionId());
        response.setSubscriptionName(remainder.getSubscriptionName());
        response.setNextBillingDate(remainder.getNextBillingDate());
        response.setReminderDate(remainder.getReminderDate());
        response.setBillingCycle(remainder.getBillingCycle());
        response.setDaysBefore(remainder.getDaysBefore());
        response.setCycleRef(remainder.getCycleRef());
        response.setStatus(remainder.getStatus());
        response.setCreatedAt(remainder.getCreatedAt());
        return response;
    }
}
