import type { z } from "zod";

import type {
  registerNameSchema,
  registerEmailSchema,
  registerPasswordSchema,
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  userSchema,
  tokensSchema,
  loginResponseSchema,
  registerResponseSchema,
  verifyEmailResponseSchema,
  planSchema,
  avatarSchema,
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
export type User = z.infer<typeof userSchema>;
export type Plan = z.infer<typeof planSchema>;
export type Avatar = z.infer<typeof avatarSchema>;
export type Tokens = z.infer<typeof tokensSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type VerifyEmailResponse = z.infer<typeof verifyEmailResponseSchema>;

// ─── API Standard Wrapper ────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: { message: string }[];
  };
  meta: {
    timestamp: string;
    path: string;
  };
}
