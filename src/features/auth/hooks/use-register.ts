import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { registerUser } from "@/features/auth/api/auth-api";
import { ApiError } from "@/lib/api-client";
import type { ErrorFeedbackMeta } from "@/lib/error-feedback";

import type { RegisterRequest } from "@/features/auth/types";

export function useRegister() {
  return useMutation({
    meta: {
      errorFeedback: "inline",
    } satisfies ErrorFeedbackMeta,
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: () => {
      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    onError: (error) => {
      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      if (error instanceof ApiError) {
        // Error is typed and ready for the UI to handle
      }
    },
  });
}
