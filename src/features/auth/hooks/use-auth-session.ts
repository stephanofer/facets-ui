import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { getMe } from "@/features/auth/api/auth-api";
import type { ErrorFeedbackMeta } from "@/lib/error-feedback";
import { useAuthStore } from "@/stores/auth-store";

import type { CanonicalSession } from "@/features/auth/types";

export function useAuthSession() {
  const bootstrapStatus = useAuthStore((s) => s.bootstrapStatus);
  const setSession = useAuthStore((s) => s.setSession);
  const canQuerySession =
    bootstrapStatus === "authenticated" ||
    bootstrapStatus === "recovery-required";

  return useQuery<CanonicalSession>({
    meta: {
      errorFeedback: "screen",
    } satisfies ErrorFeedbackMeta,
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const session = await getMe();
      setSession(session);
      return session;
    },
    enabled: canQuerySession,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
}
