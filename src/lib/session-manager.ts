import { queryClient } from "@/lib/query-client";
import { tokenStorage } from "@/lib/token-storage";
import { showSessionExpiredToast } from "@/lib/toast";
import { useRegisterFlowStore } from "@/stores/register-flow-store";
import { useAuthStore } from "@/stores/auth-store";
import { useLocalAuthStore } from "@/stores/local-auth-store";

import type { SessionInvalidationReason } from "@/stores/auth-store";

let invalidationPromise: Promise<void> | null = null;

export async function invalidateSession(
  reason: SessionInvalidationReason,
): Promise<void> {
  if (invalidationPromise) {
    return invalidationPromise;
  }

  invalidationPromise = (async () => {
    await tokenStorage.clearTokens();
    useAuthStore.getState().clearSession(reason);
    useLocalAuthStore.getState().reset();
    useRegisterFlowStore.getState().reset();
    queryClient.clear();

    if (reason === "session-expired") {
      showSessionExpiredToast();
    }
  })().finally(() => {
    invalidationPromise = null;
  });

  return invalidationPromise;
}
