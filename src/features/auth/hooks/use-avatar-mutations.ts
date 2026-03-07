import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

import { queryKeys } from "@/constants/query-keys";
import { deleteAvatar, uploadAvatar } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";

import type { User } from "@/features/auth/types";

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
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (formData: FormData) => uploadAvatar(formData),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData<User>(queryKeys.auth.me(), user);
      notifySuccess();
    },
    onError: () => {
      notifyError();
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: () => deleteAvatar(),
    onSuccess: () => {
      if (currentUser) {
        const nextUser: User = {
          ...currentUser,
          avatar: null,
        };

        setUser(nextUser);
        queryClient.setQueryData<User>(queryKeys.auth.me(), nextUser);
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      notifySuccess();
    },
    onError: () => {
      notifyError();
    },
  });
}
