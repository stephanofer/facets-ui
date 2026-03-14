import type { z } from "zod";

import type {
  registerNameSchema,
  registerEmailSchema,
  registerPasswordSchema,
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  canonicalSessionSchema,
  canonicalUserSchema,
  userSchema,
  sessionUserSchema,
  tokensSchema,
  loginResponseSchema,
  registerResponseSchema,
  verifyEmailResponseSchema,
  meResponseSchema,
  logoutResponseSchema,
  resendVerificationResponseSchema,
  planSchema,
  avatarSchema,
  workspaceSummarySchema,
  membershipSchema,
  workspaceRoleSchema,
  platformRoleSchema,
} from "@/features/auth/schemas/auth-schemas";

// ─── Form Types ──────────────────────────────────────────────────────
export type RegisterNameForm = z.infer<typeof registerNameSchema>;
export type RegisterEmailForm = z.infer<typeof registerEmailSchema>;
export type RegisterPasswordForm = z.infer<typeof registerPasswordSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationRequest = z.infer<
  typeof resendVerificationSchema
>;

// ─── API Response Types ──────────────────────────────────────────────
export type CanonicalSession = z.infer<typeof canonicalSessionSchema>;
export type CanonicalUser = z.infer<typeof canonicalUserSchema>;
export type User = z.infer<typeof userSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
export type Plan = z.infer<typeof planSchema>;
export type Avatar = z.infer<typeof avatarSchema>;
export type WorkspaceSummary = z.infer<typeof workspaceSummarySchema>;
export type Membership = z.infer<typeof membershipSchema>;
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;
export type PlatformRole = z.infer<typeof platformRoleSchema>;
export type Tokens = z.infer<typeof tokensSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type ResendVerificationResponse = z.infer<
  typeof resendVerificationResponseSchema
>;
