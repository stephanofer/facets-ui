import { invalidateSession } from "@/lib/session-manager";
import { ApiError } from "@/lib/api-error";
import { tokenStorage } from "@/lib/token-storage";
import { normalizeSessionUser } from "@/features/auth/normalize-session";
import { meResponseSchema } from "@/features/auth/schemas/auth-schemas";
import { queryKeys } from "@/constants/query-keys";

import type { CanonicalSession } from "@/features/auth/types";
import type { BootstrapStatus } from "@/stores/auth-store";
import { useAuthStore } from "@/stores/auth-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export { ApiError } from "@/lib/api-error";

type RequestMode = "public" | "protected" | "refresh";

type RefreshTokensResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

type SessionRehydrationResult = {
  status: BootstrapStatus;
  session?: CanonicalSession;
  error?: ApiError;
};

// ─── Token Refresh (single concurrent refresh) ──────────────────────
let refreshPromise: Promise<SessionRehydrationResult> | null = null;
let sessionRehydrationPromise: Promise<SessionRehydrationResult> | null = null;

async function rehydrateCanonicalSession(): Promise<SessionRehydrationResult> {
  if (sessionRehydrationPromise) {
    return sessionRehydrationPromise;
  }

  sessionRehydrationPromise = (async () => {
    try {
      const response = await request<unknown>(
        "/auth/me",
        {},
        "protected",
        false,
      );
      const session = normalizeSessionUser(meResponseSchema.parse(response), "me");

      const { queryClient } = await import("@/lib/query-client");

      queryClient.setQueryData(queryKeys.auth.me(), session);
      useAuthStore.getState().setSession(session);

      return {
        status: "authenticated",
        session,
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await invalidateSession("session-expired");

        return {
          status: "unauthenticated",
        };
      }

      useAuthStore.getState().requireBootstrapRecovery();

      return {
        status: "recovery-required",
      };
    } finally {
      sessionRehydrationPromise = null;
    }
  })();

  return sessionRehydrationPromise;
}

async function refreshTokens(): Promise<SessionRehydrationResult> {
  // If already refreshing, wait for the existing refresh
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        return {
          status: "unauthenticated",
        };
      }

      const data = await request<RefreshTokensResponse>(
        "/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        },
        "refresh",
      );

      await tokenStorage.setTokens(data.accessToken, data.refreshToken);

      return rehydrateCanonicalSession();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return {
          status: "unauthenticated",
          error,
        };
      }

      useAuthStore.getState().requireBootstrapRecovery();

      return {
        status: "recovery-required",
        error:
          error instanceof ApiError
            ? error
            : new ApiError(
                "No pudimos rehidratar tu sesión.",
                0,
                "SESSION_REHYDRATION_FAILED",
              ),
      };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function buildHeaders(
  mode: RequestMode,
  options: RequestInit,
): Promise<Headers> {
  const headers = new Headers(options.headers);
  const isFormDataBody = options.body instanceof FormData;

  if (mode === "protected") {
    const accessToken = await tokenStorage.getAccessToken();

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  if (
    !isFormDataBody &&
    !headers.has("Content-Type") &&
    !headers.has("content-type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

// ─── Core Client ─────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  mode: RequestMode = "protected",
  allowRefresh = mode === "protected",
): Promise<T> {
  const headers = await buildHeaders(mode, options);

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError("Error de conexión", 0, "NETWORK_ERROR");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({
      error: { message: "Error de conexión", code: "NETWORK_ERROR" },
    }));

    const error = body.error ?? {};

    if (response.status === 401 && mode === "protected" && allowRefresh) {
      const refreshResult = await refreshTokens();

      if (refreshResult.status === "authenticated") {
        return request<T>(path, options, "protected", false);
      }

      if (refreshResult.status === "recovery-required") {
        throw (
          refreshResult.error ??
          new ApiError(
            "No pudimos rehidratar tu sesión.",
            0,
            "SESSION_REHYDRATION_FAILED",
          )
        );
      }
    }

    if (response.status === 401 && mode === "protected") {
      await invalidateSession("session-expired");
    }

    throw new ApiError(
      error.message || "Algo salió mal",
      response.status,
      error.code,
      error.details,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json();
  return json.data as T;
}

// ─── Public API ──────────────────────────────────────────────────────
export function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return request<T>(path, options, "protected");
}

export function apiClientPublic<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return request<T>(path, options, "public", false);
}

export const apiClientNoAuth = apiClientPublic;
