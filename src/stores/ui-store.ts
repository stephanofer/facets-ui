import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storage } from "@/lib/storage";

import type { StateStorage } from "zustand/middleware";

type ColorSchemePreference = "system" | "light" | "dark";

interface UIState {
  colorSchemePreference: ColorSchemePreference;
  setColorSchemePreference: (preference: ColorSchemePreference) => void;
}

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      colorSchemePreference: "system",
      setColorSchemePreference: (preference) =>
        set({ colorSchemePreference: preference }),
    }),
    {
      name: "ui-store",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
