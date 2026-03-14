import { z } from "zod";

export const planFeatureSchema = z.object({
  featureCode: z.string(),
  limitType: z.string(),
  limitValue: z.number().nullable().optional(),
  featureType: z.string(),
});

export const subscriptionPlanSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  priceMonthly: z.number().nullable().optional(),
  priceYearly: z.number().nullable().optional(),
  priceCurrency: z.string().optional(),
  isDefault: z.boolean().optional(),
  sortOrder: z.number().optional(),
  features: z.array(planFeatureSchema),
});

export const subscriptionSchema = z.object({
  id: z.string(),
  status: z.string(),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string().nullable(),
  plan: subscriptionPlanSchema,
});

export const currentSubscriptionSchema = z.object({
  subscription: subscriptionSchema,
});

export const usageFeatureSchema = z.object({
  featureCode: z.string(),
  current: z.number(),
  limit: z.number().nullable(),
  limitType: z.string(),
  featureType: z.string(),
  usagePercentage: z.number(),
  limitReached: z.boolean(),
});

export const subscriptionUsageSchema = z.object({
  planCode: z.string(),
  planName: z.string(),
  features: z.array(usageFeatureSchema),
});
