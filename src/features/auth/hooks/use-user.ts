import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { getMe } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/stores/auth-store";

import type { User } from "@/features/auth/types";

export function useUser() {
  const status = useAuthStore((s) => s.status);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery<User>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const user = await getMe();
      setUser(user);
      return user;
    },
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 10, // 10 minutes — user data doesn't change often
  });
}
