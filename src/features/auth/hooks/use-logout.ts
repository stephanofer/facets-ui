import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logoutUser } from "@/features/auth/api/auth-api";
import { tokenStorage } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useRegisterFlowStore } from "@/stores/register-flow-store";

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const resetRegisterFlow = useRegisterFlowStore((s) => s.reset);
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
      resetRegisterFlow();
      queryClient.clear();
    },
  });
}
