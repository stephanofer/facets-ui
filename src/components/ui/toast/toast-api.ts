import { useToastStore } from "@/stores/toast-store";

import type { ToastInput, ToastVariant } from "@/components/ui/toast/toast-types";

type VariantToastInput = string | Omit<ToastInput, "variant">;

function resolveVariantInput(
  variant: ToastVariant,
  input: VariantToastInput,
): ToastInput {
  if (typeof input === "string") {
    return {
      variant,
      message: input,
    };
  }

  return {
    ...input,
    variant,
  };
}

function show(input: ToastInput) {
  return useToastStore.getState().show(input);
}

function dismiss(id?: string) {
  useToastStore.getState().dismiss(id);
}

export const toast = {
  show,
  dismiss,
  success: (input: VariantToastInput) => show(resolveVariantInput("success", input)),
  error: (input: VariantToastInput) => show(resolveVariantInput("error", input)),
  warning: (input: VariantToastInput) => show(resolveVariantInput("warning", input)),
  info: (input: VariantToastInput) => show(resolveVariantInput("info", input)),
} as const;

export function useToast() {
  const showToast = useToastStore((state) => state.show);
  const dismissToast = useToastStore((state) => state.dismiss);

  return {
    show: showToast,
    dismiss: dismissToast,
    success: (input: VariantToastInput) =>
      showToast(resolveVariantInput("success", input)),
    error: (input: VariantToastInput) =>
      showToast(resolveVariantInput("error", input)),
    warning: (input: VariantToastInput) =>
      showToast(resolveVariantInput("warning", input)),
    info: (input: VariantToastInput) =>
      showToast(resolveVariantInput("info", input)),
  } as const;
}
