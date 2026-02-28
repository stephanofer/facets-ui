export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    lists: () => [...queryKeys.transactions.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.transactions.lists(), filters] as const,
    details: () => [...queryKeys.transactions.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
  },
  accounts: {
    all: ["accounts"] as const,
    list: () => [...queryKeys.accounts.all, "list"] as const,
    detail: (id: string) => [...queryKeys.accounts.all, "detail", id] as const,
  },
  debts: {
    all: ["debts"] as const,
    list: () => [...queryKeys.debts.all, "list"] as const,
    detail: (id: string) => [...queryKeys.debts.all, "detail", id] as const,
  },
  loans: {
    all: ["loans"] as const,
    list: () => [...queryKeys.loans.all, "list"] as const,
    detail: (id: string) => [...queryKeys.loans.all, "detail", id] as const,
  },
  goals: {
    all: ["goals"] as const,
    list: () => [...queryKeys.goals.all, "list"] as const,
    detail: (id: string) => [...queryKeys.goals.all, "detail", id] as const,
  },
  frequentPayments: {
    all: ["frequent-payments"] as const,
    list: () => [...queryKeys.frequentPayments.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.frequentPayments.all, "detail", id] as const,
  },
} as const;
