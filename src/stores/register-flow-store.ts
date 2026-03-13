import { create } from "zustand";

interface RegisterFlowState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  // Actions
  setName: (firstName: string, lastName: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export const useRegisterFlowStore = create<RegisterFlowState>()((set) => ({
  ...initialState,

  setName: (firstName, lastName) => set({ firstName, lastName }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  // Reset is only for starting a fresh register flow from the auth landing.
  // Intra-flow back navigation must preserve draft values.
  reset: () => set(initialState),
}));
