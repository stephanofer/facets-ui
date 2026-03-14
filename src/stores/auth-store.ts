import { create } from "zustand";

import type { CanonicalSession, User } from "@/features/auth/types";

export type BootstrapStatus =
  | "bootstrapping"
  | "authenticated"
  | "unauthenticated"
  | "recovery-required";

export type SessionSource = "login" | "verify-email" | "me";

export type SessionInvalidationReason =
  | "missing-tokens"
  | "session-expired"
  | "manual-logout"
  | "bootstrap-failed";

interface AuthState {
  bootstrapStatus: BootstrapStatus;
  session: CanonicalSession | null;
  lastInvalidationReason: SessionInvalidationReason | null;
  initializeSession: () => void;
  setSession: (session: CanonicalSession) => void;
  requireBootstrapRecovery: () => void;
  updateSessionUser: (user: User) => void;
  clearSession: (reason: SessionInvalidationReason) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  bootstrapStatus: "bootstrapping",
  session: null,
  lastInvalidationReason: null,

  initializeSession: () => {
    set({
      bootstrapStatus: "bootstrapping",
      lastInvalidationReason: null,
    });
  },

  setSession: (session) => {
    set({
      bootstrapStatus: "authenticated",
      lastInvalidationReason: null,
      session,
    });
  },

  requireBootstrapRecovery: () => {
    set({
      bootstrapStatus: "recovery-required",
      session: null,
      lastInvalidationReason: "bootstrap-failed",
    });
  },

  updateSessionUser: (user) => {
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          user,
          lastHydratedAt: new Date().toISOString(),
        },
      };
    });
  },

  clearSession: (reason) => {
    set({
      bootstrapStatus: "unauthenticated",
      session: null,
      lastInvalidationReason: reason,
    });
  },
}));
