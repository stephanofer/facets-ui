import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { getCurrentWorkspace } from "@/features/workspaces/api/workspaces-api";
import type { ErrorFeedbackMeta } from "@/lib/error-feedback";
import { useAuthStore } from "@/stores/auth-store";

import type { CurrentWorkspace } from "@/features/workspaces/types";

export function useCurrentWorkspace() {
  const bootstrapStatus = useAuthStore((s) => s.bootstrapStatus);
  const canQueryWorkspace =
    bootstrapStatus === "authenticated" ||
    bootstrapStatus === "recovery-required";

  return useQuery<CurrentWorkspace>({
    meta: {
      errorFeedback: "screen",
    } satisfies ErrorFeedbackMeta,
    queryKey: queryKeys.workspaces.current(),
    queryFn: getCurrentWorkspace,
    enabled: canQueryWorkspace,
  });
}
