import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { verifyEmail } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";

import type { VerifyEmailRequest } from "@/features/auth/types";

export function useVerifyEmail() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => verifyEmail(data),
    onSuccess: async (response) => {
      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      // Verify email endpoint returns tokens — auto-login
      await setSession(response.tokens, response.user);
    },
    onError: () => {
      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
  });
}
