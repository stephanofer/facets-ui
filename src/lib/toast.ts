import { createElement } from "react";

import { Toaster, toast } from "sonner-native";

type AuthToastTone = "error" | "warning";
type AuthToastKind = "login" | "register" | "verify-email" | "resend-verification";

const SESSION_EXPIRED_TOAST_ID = "session-expired";
const PERMISSION_TOAST_ID = "permission-denied";
const NETWORK_TOAST_ID = "network-error";
const SERVER_TOAST_ID = "server-error";
const UNAVAILABLE_TOAST_ID = "resource-unavailable";
const SESSION_RECOVERY_TOAST_ID = "session-recovery";
const VERIFY_EMAIL_INVALID_ENTRY_TOAST_ID = "verify-email-invalid-entry";
const AUTH_TOAST_IDS: Record<AuthToastKind, string> = {
  login: "auth-login-feedback",
  register: "auth-register-feedback",
  "verify-email": "auth-verify-email-feedback",
  "resend-verification": "auth-resend-verification-feedback",
};

function showAuthToast(
  kind: AuthToastKind,
  title: string,
  description?: string,
  tone: AuthToastTone = "error",
) {
  const toastMethod = tone === "warning" ? toast.warning : toast.error;

  toastMethod(title, {
    id: AUTH_TOAST_IDS[kind],
    description,
    duration: 2800,
  });
}

export function AppToaster() {
  return createElement(Toaster, {
    closeButton: true,
    position: "top-center",
    richColors: true,
  });
}

export function showSessionExpiredToast() {
  toast.error("Tu sesion vencio", {
    id: SESSION_EXPIRED_TOAST_ID,
    description: "Volve a iniciar sesion para continuar.",
    duration: 2800,
  });
}

export function showPermissionToast(description?: string) {
  toast.warning("No tenes acceso a esta accion", {
    id: PERMISSION_TOAST_ID,
    description,
  });
}

export function showNetworkToast(description?: string) {
  toast.error("Error de conexion", {
    id: NETWORK_TOAST_ID,
    description: description ?? "Verifica tu internet e intenta de nuevo.",
  });
}

export function showServerToast(description?: string) {
  toast.error("Algo salio mal", {
    id: SERVER_TOAST_ID,
    description: description ?? "Intenta de nuevo en unos segundos.",
  });
}

export function showUnavailableToast(description?: string) {
  toast("No encontramos lo que buscabas", {
    id: UNAVAILABLE_TOAST_ID,
    description: description ?? "Puede no estar disponible en este workspace.",
  });
}

export function showSessionRecoveryToast(description?: string) {
  toast.error("No pudimos rehidratar tu sesion", {
    id: SESSION_RECOVERY_TOAST_ID,
    description:
      description ?? "Reintenta para recuperar el espacio autenticado.",
  });
}

export function showInvalidVerifyEmailEntryToast() {
  toast.error("No pudimos abrir la verificacion", {
    id: VERIFY_EMAIL_INVALID_ENTRY_TOAST_ID,
    description: "Volvé a iniciar sesion o creá tu cuenta de nuevo.",
    duration: 2800,
  });
}

export function showLoginFailureToast(
  description: string,
  options?: { title?: string; tone?: AuthToastTone },
) {
  showAuthToast(
    "login",
    options?.title ?? "No pudimos iniciar sesion",
    description,
    options?.tone,
  );
}

export function showRegisterFailureToast(
  description: string,
  options?: { title?: string; tone?: AuthToastTone },
) {
  showAuthToast(
    "register",
    options?.title ?? "No pudimos crear la cuenta",
    description,
    options?.tone,
  );
}

export function showVerifyEmailFailureToast(
  description: string,
  options?: { title?: string; tone?: AuthToastTone },
) {
  showAuthToast(
    "verify-email",
    options?.title ?? "No pudimos verificar el codigo",
    description,
    options?.tone,
  );
}

export function showResendVerificationFailureToast(
  description: string,
  options?: { title?: string; tone?: AuthToastTone },
) {
  showAuthToast(
    "resend-verification",
    options?.title ?? "No pudimos reenviar el codigo",
    description,
    options?.tone,
  );
}

export function showErrorToast(title: string, description?: string) {
  toast.error(title, {
    description,
  });
}

export function showWarningToast(title: string, description?: string) {
  toast.warning(title, {
    description,
  });
}
