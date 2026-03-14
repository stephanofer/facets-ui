import { apiClient } from "@/lib/api-client";
import {
  currentSubscriptionSchema,
  subscriptionUsageSchema,
} from "@/features/subscriptions/schemas/subscription-schema";

import type {
  CurrentSubscription,
  SubscriptionUsage,
} from "@/features/subscriptions/types";

export async function getCurrentSubscription(): Promise<CurrentSubscription> {
  const response = await apiClient<unknown>("/subscriptions/current");

  return currentSubscriptionSchema.parse(response);
}

export async function getSubscriptionUsage(): Promise<SubscriptionUsage> {
  const response = await apiClient<unknown>("/subscriptions/usage");

  return subscriptionUsageSchema.parse(response);
}
