import { z } from "zod";

import { membershipSchema, workspaceSummarySchema } from "@/features/auth/schemas/auth-schemas";

export const workspaceSettingsSchema = z.object({
  baseCurrencyCode: z.string(),
  baseLanguage: z.string(),
  dateFormat: z.string(),
  monthStartDay: z.number(),
  weekStartDay: z.number(),
  timezone: z.string(),
  locale: z.string(),
  displayLabel: z.string(),
});

export const workspaceSchema = workspaceSummarySchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const currentWorkspaceSchema = z.object({
  workspace: workspaceSchema,
  membership: membershipSchema,
  settings: workspaceSettingsSchema,
});
