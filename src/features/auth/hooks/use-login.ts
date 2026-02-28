import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { loginUser } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";
import { ApiError } from "@/lib/api-client";

import type { LoginRequest } from "@/features/auth/types";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: async (response) => {
      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      await setSession(response.tokens, response.user);
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
