import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { queryKeys } from "@/constants/query-keys";
import { getCurrentSubscription, getSubscriptionUsage } from "@/features/subscriptions/api/subscriptions-api";
import { loginUser } from "@/features/auth/api/auth-api";
import { normalizeSessionUser } from "@/features/auth/normalize-session";
import { getCurrentWorkspace } from "@/features/workspaces/api/workspaces-api";
import { ApiError } from "@/lib/api-client";
import type { ErrorFeedbackMeta } from "@/lib/error-feedback";
import { tokenStorage } from "@/lib/token-storage";
import { useAuthStore } from "@/stores/auth-store";

import type { LoginRequest } from "@/features/auth/types";

export function useLogin() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    meta: {
      errorFeedback: "inline",
    } satisfies ErrorFeedbackMeta,
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: async (response) => {
      const session = normalizeSessionUser(response.user, "login");

      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      await tokenStorage.setTokens(
        response.tokens.accessToken,
        response.tokens.refreshToken,
      );

      setSession(session);
      queryClient.setQueryData(queryKeys.auth.me(), session);

      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: queryKeys.workspaces.current(),
          queryFn: getCurrentWorkspace,
        }),
        queryClient.prefetchQuery({
          queryKey: queryKeys.subscriptions.current(),
          queryFn: getCurrentSubscription,
        }),
        queryClient.prefetchQuery({
          queryKey: queryKeys.subscriptions.usage(),
          queryFn: getSubscriptionUsage,
        }),
      ]);
    },
    onError: (error) => {
      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      if (error instanceof ApiError) {
        // The UI handles specific error codes (EMAIL_NOT_VERIFIED, etc.)
      }
    },
  });
}
