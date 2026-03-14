import { useMutation } from "@tanstack/react-query";

import { resendVerification } from "@/features/auth/api/auth-api";
import type { ErrorFeedbackMeta } from "@/lib/error-feedback";

export function useResendVerification() {
  return useMutation({
    meta: {
      errorFeedback: "inline",
    } satisfies ErrorFeedbackMeta,
    mutationFn: (email: string) => resendVerification(email),
  });
}
