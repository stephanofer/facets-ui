import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// ─── Secure Storage Keys ─────────────────────────────────────────────
const TOKEN_KEYS = {
  access: "auth_access_token",
  refresh: "auth_refresh_token",
} as const;

// ─── Token Management ────────────────────────────────────────────────
export const tokenStorage = {
  getAccessToken: () => SecureStore.getItemAsync(TOKEN_KEYS.access),
  getRefreshToken: () => SecureStore.getItemAsync(TOKEN_KEYS.refresh),
  setTokens: async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync(TOKEN_KEYS.access, accessToken);
    await SecureStore.setItemAsync(TOKEN_KEYS.refresh, refreshToken);
  },
  clearTokens: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEYS.access);
    await SecureStore.deleteItemAsync(TOKEN_KEYS.refresh);
  },
};

// ─── Error Class ─────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: { message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Auth Header ─────────────────────────────────────────────────────
async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await tokenStorage.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Token Refresh (single concurrent refresh) ──────────────────────
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  // If already refreshing, wait for the existing refresh
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        await tokenStorage.clearTokens();
        return false;
      }

      const json = await response.json();
      const data = json.data;
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      await tokenStorage.clearTokens();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Core Client ─────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({
      error: { message: "Error de conexión", code: "NETWORK_ERROR" },
    }));

    const error = body.error ?? {};

    // If 401 and we can retry — attempt token refresh
    if (response.status === 401 && retry) {
      const refreshed = await refreshTokens();
      if (refreshed) {
        return request<T>(path, options, false);
      }
    }

    throw new ApiError(
      error.message || "Algo salió mal",
      response.status,
      error.code,
      error.details,
    );
  }

  // Unwrap the standard API response: { success, data, meta }
  const json = await response.json();
  return json.data as T;
}

// ─── Public API ──────────────────────────────────────────────────────
export function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return request<T>(path, options);
}

// For endpoints that should NOT trigger token refresh (login, register, etc.)
export function apiClientNoAuth<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return request<T>(
    path,
    { ...options, headers: { ...options.headers } },
    false,
  );
}
