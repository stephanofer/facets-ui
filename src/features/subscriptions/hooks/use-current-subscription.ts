import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { getCurrentSubscription } from "@/features/subscriptions/api/subscriptions-api";
import type { ErrorFeedbackMeta } from "@/lib/error-feedback";
import { useAuthStore } from "@/stores/auth-store";

import type { CurrentSubscription } from "@/features/subscriptions/types";

export function useCurrentSubscription() {
  const bootstrapStatus = useAuthStore((s) => s.bootstrapStatus);
  const canQuerySubscription =
    bootstrapStatus === "authenticated" ||
    bootstrapStatus === "recovery-required";

  return useQuery<CurrentSubscription>({
    meta: {
      errorFeedback: "screen",
    } satisfies ErrorFeedbackMeta,
    queryKey: queryKeys.subscriptions.current(),
    queryFn: getCurrentSubscription,
    enabled: canQuerySubscription,
  });
}
