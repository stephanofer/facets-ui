import { create } from "zustand";

import {
  createToastRecord,
  type ToastInput,
  type ToastRecord,
} from "@/components/ui/toast/toast-types";

interface ToastStoreState {
  current: ToastRecord | null;
  queue: ToastRecord[];
  show: (input: ToastInput) => string;
  dismiss: (id?: string) => void;
  shiftNext: () => void;
  clear: () => void;
}

export const useToastStore = create<ToastStoreState>()((set, get) => ({
  current: null,
  queue: [],
  show: (input) => {
    const record = createToastRecord(input);

    set((state) =>
      state.current
        ? { queue: [...state.queue, record] }
        : { current: record },
    );

    return record.id;
  },
  dismiss: (id) => {
    set((state) => {
      if (!id || state.current?.id === id) {
        return { current: null };
      }

      return {
        queue: state.queue.filter((toast) => toast.id !== id),
      };
    });
  },
  shiftNext: () => {
    const { current, queue } = get();

    if (current || queue.length === 0) {
      return;
    }

    const [next, ...rest] = queue;

    set({ current: next, queue: rest });
  },
  clear: () => {
    set({ current: null, queue: [] });
  },
}));
