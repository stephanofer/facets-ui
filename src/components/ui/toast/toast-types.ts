import type { IconName } from "@/components/ui/icon";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastInput {
  id?: string;
  variant?: ToastVariant;
  title?: string;
  message?: string;
  durationMs?: number | null;
  dismissible?: boolean;
  iconName?: IconName;
}

export interface ToastRecord {
  id: string;
  variant: ToastVariant;
  title?: string;
  message?: string;
  durationMs: number | null;
  dismissible: boolean;
  iconName: IconName;
  createdAt: number;
}

export const DEFAULT_TOAST_DURATION_MS = 4200;

export const toastVariantMeta: Record<
  ToastVariant,
  {
    iconName: IconName;
    title: string;
    accentColor: string;
    accentSoft: string;
  }
> = {
  success: {
    iconName: "CheckCircle",
    title: "Success",
    accentColor: "#22C55E",
    accentSoft: "rgba(34, 197, 94, 0.16)",
  },
  error: {
    iconName: "XCircle",
    title: "Something Went Wrong",
    accentColor: "#FF4D5E",
    accentSoft: "rgba(255, 77, 94, 0.18)",
  },
  warning: {
    iconName: "WarningCircle",
    title: "Heads Up",
    accentColor: "#F59E0B",
    accentSoft: "rgba(245, 158, 11, 0.18)",
  },
  info: {
    iconName: "Info",
    title: "For Your Information",
    accentColor: "#38BDF8",
    accentSoft: "rgba(56, 189, 248, 0.18)",
  },
};

export function createToastRecord(input: ToastInput): ToastRecord {
  const variant = input.variant ?? "info";
  const meta = toastVariantMeta[variant];

  return {
    id: input.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    variant,
    title: input.title,
    message: input.message,
    durationMs:
      input.durationMs === undefined
        ? DEFAULT_TOAST_DURATION_MS
        : input.durationMs,
    dismissible: input.dismissible ?? true,
    iconName: input.iconName ?? meta.iconName,
    createdAt: Date.now(),
  };
}
