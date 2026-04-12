package com.ishadh.submanager.modules.remainder;

import com.ishadh.submanager.modules.subscription.BillingCycle;
import lombok.Data;

@Data
public class RemainderResponse {

    private String id;
    private String subscriptionId;
    private String subscriptionName;
    private Long nextBillingDate;
    private Long reminderDate;
    private BillingCycle billingCycle;
    private Integer daysBefore;
    private String cycleRef;
    private RemainderStatus status;
    private Long createdAt;
}
