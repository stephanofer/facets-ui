import { useMutation } from "@tanstack/react-query";

import { resendVerification } from "@/features/auth/api/auth-api";

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
  });
}
