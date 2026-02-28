import { create } from "zustand";
import { persist } from "zustand/middleware";

import { zustandStorage } from "@/lib/storage";

type ColorSchemePreference = "system" | "light" | "dark";

interface UIState {
  colorSchemePreference: ColorSchemePreference;
  setColorSchemePreference: (preference: ColorSchemePreference) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      colorSchemePreference: "system",
      setColorSchemePreference: (preference) =>
        set({ colorSchemePreference: preference }),
    }),
    {
      name: "ui-store",
      storage: zustandStorage,
    },
  ),
);
