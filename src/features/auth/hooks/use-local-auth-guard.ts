import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";

import { useAuthStore } from "@/stores/auth-store";
import { useLocalAuthStore } from "@/stores/local-auth-store";

const INACTIVITY_THRESHOLD_MS = 3 * 60 * 1000;
const RECENT_UNLOCK_GRACE_MS = 15 * 1000;

export function useLocalAuthGuard() {
  const bootstrapStatus = useAuthStore((s) => s.bootstrapStatus);
  const hasSession = useAuthStore((s) => Boolean(s.session));
  const appStateRef = useRef(AppState.currentState);

  const refreshCapability = useCallback(async () => {
    const supported = await LocalAuthentication.hasHardwareAsync();

    if (!supported) {
      const capability = {
        supported: false,
        enrolled: false,
        authenticationTypes: [],
        checkedAt: Date.now(),
      };

      useLocalAuthStore.getState().setCapability(capability);
      return capability;
    }

    const [enrolled, authenticationTypes] = await Promise.all([
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync().catch(() => []),
    ]);

    const capability = {
      supported,
      enrolled,
      authenticationTypes,
      checkedAt: Date.now(),
    };

    useLocalAuthStore.getState().setCapability(capability);
    return capability;
  }, []);

  const promptForUnlock = useCallback(async () => {
    const localAuthState = useLocalAuthStore.getState();

    if (localAuthState.isPromptInFlight) {
      return false;
    }

    localAuthState.setPromptInFlight(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Desbloquea Facets",
        promptDescription:
          "Confirma tu identidad para volver al espacio autenticado.",
        promptSubtitle: "Tu sesion remota sigue activa.",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
        requireConfirmation: false,
      });

      if (result.success) {
        useLocalAuthStore.getState().markUnlockSuccess(Date.now());
        return true;
      }

      useLocalAuthStore.getState().lockShell(true);
      return false;
    } catch {
      useLocalAuthStore.getState().lockShell(true);
      return false;
    } finally {
      useLocalAuthStore.getState().setPromptInFlight(false);
    }
  }, []);

  const retryUnlock = useCallback(async () => {
    if (bootstrapStatus !== "authenticated" || !useAuthStore.getState().session) {
      return false;
    }

    const localAuthState = useLocalAuthStore.getState();
    const capability = localAuthState.capability ?? (await refreshCapability());

    if (!capability.supported || !capability.enrolled) {
      localAuthState.unlockShell();
      return true;
    }

    localAuthState.lockShell(false);
    return promptForUnlock();
  }, [bootstrapStatus, promptForUnlock, refreshCapability]);

  useEffect(() => {
    if (bootstrapStatus !== "authenticated" || !hasSession) {
      useLocalAuthStore.getState().reset();
      return;
    }

    void refreshCapability();
  }, [bootstrapStatus, hasSession, refreshCapability]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (bootstrapStatus !== "authenticated" || !useAuthStore.getState().session) {
        return;
      }

      const localAuthState = useLocalAuthStore.getState();

      if (nextAppState !== "active" && previousAppState === "active") {
        if (!localAuthState.isPromptInFlight) {
          localAuthState.markBackgrounded(Date.now());
        }
        return;
      }

      if (nextAppState !== "active" || previousAppState === "active") {
        return;
      }

      if (localAuthState.isPromptInFlight) {
        return;
      }

      if (localAuthState.requiresManualRetry) {
        localAuthState.lockShell(true);
        return;
      }

      if (!localAuthState.lastBackgroundedAt) {
        return;
      }

      const now = Date.now();

      if (
        localAuthState.lastSuccessfulUnlockAt &&
        now - localAuthState.lastSuccessfulUnlockAt < RECENT_UNLOCK_GRACE_MS
      ) {
        localAuthState.unlockShell();
        return;
      }

      if (now - localAuthState.lastBackgroundedAt < INACTIVITY_THRESHOLD_MS) {
        localAuthState.unlockShell();
        return;
      }

      void retryUnlock();
    });

    return () => {
      subscription.remove();
    };
  }, [bootstrapStatus, retryUnlock]);

  return {
    retryUnlock,
  };
}
