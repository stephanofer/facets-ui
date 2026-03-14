import { useEffect } from "react";

import { queryKeys } from "@/constants/query-keys";
import { getMe } from "@/features/auth/api/auth-api";
import { ApiError } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import { invalidateSession } from "@/lib/session-manager";
import { tokenStorage } from "@/lib/token-storage";
import { useAuthStore } from "@/stores/auth-store";

import type { CanonicalSession } from "@/features/auth/types";

export function useAuthBootstrap() {
  const initializeSession = useAuthStore((s) => s.initializeSession);
  const setSession = useAuthStore((s) => s.setSession);
  const requireBootstrapRecovery = useAuthStore((s) => s.requireBootstrapRecovery);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      initializeSession();

      const [accessToken, refreshToken] = await Promise.all([
        tokenStorage.getAccessToken(),
        tokenStorage.getRefreshToken(),
      ]);

      if (!accessToken || !refreshToken) {
        await invalidateSession("missing-tokens");
        return;
      }

      try {
        const session = await queryClient.fetchQuery<CanonicalSession>({
          queryKey: queryKeys.auth.me(),
          queryFn: getMe,
          retry: false,
          staleTime: 1000 * 60 * 10,
        });

        if (cancelled) {
          return;
        }

        setSession(session);
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          await invalidateSession("session-expired");
          return;
        }

        requireBootstrapRecovery();
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [initializeSession, requireBootstrapRecovery, setSession]);
}
