import * as SecureStore from "expo-secure-store";

const TOKEN_KEYS = {
  access: "auth_access_token",
  refresh: "auth_refresh_token",
} as const;

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
