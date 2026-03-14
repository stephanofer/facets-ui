import { apiClient, apiClientPublic } from "@/lib/api-client";
import { normalizeSessionUser } from "@/features/auth/normalize-session";
import {
  loginResponseSchema,
  logoutResponseSchema,
  meResponseSchema,
  registerResponseSchema,
  resendVerificationResponseSchema,
  userSchema,
  verifyEmailResponseSchema,
} from "@/features/auth/schemas/auth-schemas";

import type {
  CanonicalSession,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  ResendVerificationResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  User,
} from "@/features/auth/types";

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await apiClientPublic<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return registerResponseSchema.parse(response);
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClientPublic<unknown>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return loginResponseSchema.parse(response);
}

export async function verifyEmail(
  data: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
  const response = await apiClientPublic<unknown>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return verifyEmailResponseSchema.parse(response);
}

export async function resendVerification(
  email: string,
): Promise<ResendVerificationResponse> {
  const response = await apiClientPublic<unknown>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  return resendVerificationResponseSchema.parse(response);
}

export async function logoutUser(refreshToken: string): Promise<LogoutResponse> {
  const response = await apiClient<unknown>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  return logoutResponseSchema.parse(response);
}

export async function getMe(): Promise<CanonicalSession> {
  const response = await apiClient<unknown>("/auth/me");
  const sessionUser = meResponseSchema.parse(response);

  return normalizeSessionUser(sessionUser, "me");
}

export async function uploadAvatar(formData: FormData): Promise<User> {
  const response = await apiClient<unknown>("/auth/me/avatar", {
    method: "PUT",
    body: formData,
  });

  return userSchema.parse(response);
}

export function deleteAvatar(): Promise<void> {
  return apiClient<void>("/auth/me/avatar", {
    method: "DELETE",
  });
}
