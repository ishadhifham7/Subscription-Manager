package com.ishadh.submanager.modules.subscription;

import lombok.Data;

@Data
public class SubscriptionRequest {

    private String name;
    private String description;
    private double price;
    private String currency;
    private BillingCycle billingCycle;
    private String categoryId;
    private Integer reminderDaysBefore;
}
