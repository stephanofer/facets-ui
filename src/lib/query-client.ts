import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import {
  getErrorFeedbackMode,
  handleErrorFeedback,
  shouldRetryQueryError,
} from "@/lib/error-feedback";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      handleErrorFeedback(error, {
        source: "query",
        mode: getErrorFeedbackMode(query.meta) ?? "screen",
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      handleErrorFeedback(error, {
        source: "mutation",
        mode: getErrorFeedbackMode(mutation.meta) ?? "auto",
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: shouldRetryQueryError,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
    },
    mutations: {
      retry: false,
    },
  },
});
