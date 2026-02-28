import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";
import { tokenStorage } from "@/lib/api-client";

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        // Best-effort logout on server — don't block on failure
        await logoutUser(refreshToken).catch(() => {});
      }
    },
    onSettled: async () => {
      await logout();
      queryClient.clear();
    },
  });
}
