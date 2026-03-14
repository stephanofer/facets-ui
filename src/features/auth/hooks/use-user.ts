import { useAuthSession } from "@/features/auth/hooks/use-auth-session";

import type { User } from "@/features/auth/types";

export function useUser() {
  const sessionQuery = useAuthSession();

  return {
    ...sessionQuery,
    data: sessionQuery.data?.user as User | undefined,
  };
}
