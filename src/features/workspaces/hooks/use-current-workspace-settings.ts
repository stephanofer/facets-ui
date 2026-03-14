import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { getCurrentWorkspaceSettings } from "@/features/workspaces/api/workspaces-api";
import type { ErrorFeedbackMeta } from "@/lib/error-feedback";
import { useAuthStore } from "@/stores/auth-store";

import type { WorkspaceSettings } from "@/features/workspaces/types";

export function useCurrentWorkspaceSettings() {
  const bootstrapStatus = useAuthStore((s) => s.bootstrapStatus);

  return useQuery<WorkspaceSettings>({
    meta: {
      errorFeedback: "screen",
    } satisfies ErrorFeedbackMeta,
    queryKey: queryKeys.workspaces.currentSettings(),
    queryFn: getCurrentWorkspaceSettings,
    enabled: bootstrapStatus === "authenticated",
  });
}
