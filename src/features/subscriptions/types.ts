import type { z } from "zod";

import type {
  currentSubscriptionSchema,
  planFeatureSchema,
  subscriptionPlanSchema,
  subscriptionSchema,
  subscriptionUsageSchema,
  usageFeatureSchema,
} from "@/features/subscriptions/schemas/subscription-schema";

export type PlanFeature = z.infer<typeof planFeatureSchema>;
export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type CurrentSubscription = z.infer<typeof currentSubscriptionSchema>;
export type UsageFeature = z.infer<typeof usageFeatureSchema>;
export type SubscriptionUsage = z.infer<typeof subscriptionUsageSchema>;
