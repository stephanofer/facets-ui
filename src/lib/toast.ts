import { createElement } from "react";

import { Toaster, toast } from "sonner-native";

const SESSION_EXPIRED_TOAST_ID = "session-expired";
const PERMISSION_TOAST_ID = "permission-denied";
const NETWORK_TOAST_ID = "network-error";
const SERVER_TOAST_ID = "server-error";
const UNAVAILABLE_TOAST_ID = "resource-unavailable";
const SESSION_RECOVERY_TOAST_ID = "session-recovery";

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
