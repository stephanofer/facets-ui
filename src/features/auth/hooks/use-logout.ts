import { useMutation } from "@tanstack/react-query";

import { logoutUser } from "@/features/auth/api/auth-api";
import { invalidateSession } from "@/lib/session-manager";
import { tokenStorage } from "@/lib/token-storage";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        // Best-effort logout on server — don't block on failure
        await logoutUser(refreshToken).catch(() => {});
      }
    },
    onSettled: async () => {
      await invalidateSession("manual-logout");
    },
  });
}
