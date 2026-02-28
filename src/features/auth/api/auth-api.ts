import { apiClient } from "@/lib/api-client";

import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  User,
} from "@/features/auth/types";

export function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  return apiClient<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyEmail(
  data: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
  return apiClient<VerifyEmailResponse>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resendVerification(
  email: string,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function logoutUser(refreshToken: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function getMe(): Promise<User> {
  return apiClient<User>("/auth/me");
}
