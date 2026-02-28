import { createMMKV } from "react-native-mmkv";
import { createJSONStorage } from "zustand/middleware";

import type { StateStorage } from "zustand/middleware";

export const storage = createMMKV();

// Shared Zustand MMKV adapter — used by all Zustand stores with persist
const zustandMMKVStorage: StateStorage = {
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

export const zustandStorage = createJSONStorage(() => zustandMMKVStorage);
