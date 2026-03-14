import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { queryKeys } from "@/constants/query-keys";
import { deleteAvatar, uploadAvatar } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";

import type { CanonicalSession, User } from "@/features/auth/types";

function notifySuccess() {
  if (process.env.EXPO_OS === "ios") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

function notifyError() {
  if (process.env.EXPO_OS === "ios") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const updateSessionUser = useAuthStore((s) => s.updateSessionUser);

  return useMutation({
    mutationFn: (formData: FormData) => uploadAvatar(formData),
    onSuccess: (user) => {
      updateSessionUser(user);
      queryClient.setQueryData<CanonicalSession | undefined>(
        queryKeys.auth.me(),
        (currentSession) => {
          if (!currentSession) {
            return currentSession;
          }

          return {
            ...currentSession,
            user,
            lastHydratedAt: new Date().toISOString(),
          };
        },
      );

      notifySuccess();
    },
    onError: () => {
      notifyError();
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const updateSessionUser = useAuthStore((s) => s.updateSessionUser);
  const currentUser = useAuthStore((s) => s.session?.user);

  return useMutation({
    mutationFn: () => deleteAvatar(),
    onSuccess: () => {
      if (currentUser) {
        const nextUser: User = {
          ...currentUser,
          avatar: null,
        };

        updateSessionUser(nextUser);
        queryClient.setQueryData<CanonicalSession | undefined>(
          queryKeys.auth.me(),
          (currentSession) => {
            if (!currentSession) {
              return currentSession;
            }

            return {
              ...currentSession,
              user: nextUser,
              lastHydratedAt: new Date().toISOString(),
            };
          },
        );
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      notifySuccess();
    },
    onError: () => {
      notifyError();
    },
  });
}
