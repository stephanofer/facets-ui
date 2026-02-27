import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
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
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      body.message || "Request failed",
      response.status,
      body.code,
    );
  }

  return response.json();
}
