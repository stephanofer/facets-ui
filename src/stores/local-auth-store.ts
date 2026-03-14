import { create } from "zustand";

interface LocalAuthCapability {
  supported: boolean;
  enrolled: boolean;
  authenticationTypes: number[];
  checkedAt: number;
}

interface LocalAuthState {
  isLocked: boolean;
  isPromptInFlight: boolean;
  requiresManualRetry: boolean;
  lastBackgroundedAt: number | null;
  lastSuccessfulUnlockAt: number | null;
  capability: LocalAuthCapability | null;
  setCapability: (capability: LocalAuthCapability) => void;
  markBackgrounded: (timestamp: number) => void;
  lockShell: (requiresManualRetry?: boolean) => void;
  unlockShell: () => void;
  markUnlockSuccess: (timestamp: number) => void;
  setPromptInFlight: (inFlight: boolean) => void;
  reset: () => void;
}

const initialState = {
  isLocked: false,
  isPromptInFlight: false,
  requiresManualRetry: false,
  lastBackgroundedAt: null,
  lastSuccessfulUnlockAt: null,
  capability: null,
} as const;

export const useLocalAuthStore = create<LocalAuthState>()((set) => ({
  ...initialState,

  setCapability: (capability) => {
    set({ capability });
  },

  markBackgrounded: (timestamp) => {
    set({ lastBackgroundedAt: timestamp });
  },

  lockShell: (requiresManualRetry = false) => {
    set({
      isLocked: true,
      isPromptInFlight: false,
      requiresManualRetry,
    });
  },

  unlockShell: () => {
    set({
      isLocked: false,
      isPromptInFlight: false,
      requiresManualRetry: false,
      lastBackgroundedAt: null,
    });
  },

  markUnlockSuccess: (timestamp) => {
    set({
      isLocked: false,
      isPromptInFlight: false,
      requiresManualRetry: false,
      lastBackgroundedAt: null,
      lastSuccessfulUnlockAt: timestamp,
    });
  },

  setPromptInFlight: (inFlight) => {
    set({ isPromptInFlight: inFlight });
  },

  reset: () => {
    set(initialState);
  },
}));
