import { create } from "zustand";

import { tokenStorage } from "@/lib/api-client";

import type { User, Tokens } from "@/features/auth/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: User | null;

  // Actions
  initialize: () => Promise<void>;
  setSession: (tokens: Tokens, user: User) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  status: "loading",
  user: null,

  initialize: async () => {
    try {
      const accessToken = await tokenStorage.getAccessToken();
      if (accessToken) {
        // We have a token — mark as authenticated
        // The actual user data will be fetched by useUser query
        set({ status: "authenticated" });
      } else {
        set({ status: "unauthenticated", user: null });
      }
    } catch {
      set({ status: "unauthenticated", user: null });
    }
  },

  setSession: async (tokens, user) => {
    await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    set({ status: "authenticated", user });
  },

  setUser: (user) => {
    set({ user });
  },

  logout: async () => {
    await tokenStorage.clearTokens();
    set({ status: "unauthenticated", user: null });
  },
}));
