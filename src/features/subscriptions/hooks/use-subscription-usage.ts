import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { getSubscriptionUsage } from "@/features/subscriptions/api/subscriptions-api";
import type { ErrorFeedbackMeta } from "@/lib/error-feedback";
import { useAuthStore } from "@/stores/auth-store";

import type { SubscriptionUsage } from "@/features/subscriptions/types";

export function useSubscriptionUsage() {
  const bootstrapStatus = useAuthStore((s) => s.bootstrapStatus);
  const canQueryUsage =
    bootstrapStatus === "authenticated" ||
    bootstrapStatus === "recovery-required";

  return useQuery<SubscriptionUsage>({
    meta: {
      errorFeedback: "screen",
    } satisfies ErrorFeedbackMeta,
    queryKey: queryKeys.subscriptions.usage(),
    queryFn: getSubscriptionUsage,
    enabled: canQueryUsage,
  });
}
