package com.ishadh.submanager.modules.subscription;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;

@Data
public class Subscription {

    @DocumentId
    private String id;

    private String name;
    private String description;
    private double price;
    private String currency;
    private BillingCycle billingCycle;
    private String categoryId;

    private Integer reminderDaysBefore;

    private Boolean active;

    private Long startDate;
    private Long nextBillingDate;

    private Long createdAt;
    private Long updatedAt;
}