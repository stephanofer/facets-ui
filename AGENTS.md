Facets is a professional finance tracker SaaS application. It supports multi-tenant user accounts with features like transaction (e.g Expenses, Incomes) tracking, accounts (e.g debit card, cash), debts management, loans management, goals, and frequent payments. Available on iOS, Android and Web.

Designed to be scalable, to quickly add new features, and to support multiple countries and currencies. Pricing: free tier + 2 paid plans.

---

### Architectural Principles

| Principle                       | What it means in practice                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| **Simplicity First**            | If it's complex, it's wrong. Every abstraction must earn its place.                           |
| **Feature Isolation**           | Each feature is a self-contained module. Adding a new feature NEVER touches existing ones.    |
| **Server State ≠ Client State** | Server data lives in TanStack Query. Client-only state lives in Zustand. NEVER mix them.      |
| **Type Safety Everywhere**      | Zod schemas are the single source of truth. Types are DERIVED, never duplicated.              |
| **No Barrel Files**             | Always import directly from the source file. NEVER use `index.ts` for re-exports.             |
| **Platform-Native Feel**        | Use native components and patterns. The app should feel like it belongs on each platform.     |
| **Scalability by Convention**   | The folder structure and patterns make it obvious where new code goes.                        |
| **Animations**                  | Professional, subtle, elegant. Always provide feedback on user actions. No animation > 300ms. |

---

## Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                         | Skill                  |
| ------------------------------ | ---------------------- |
| Work building native UI        | `building-native-ui`   |
| Work with Expo API Routes      | `expo-api-routes`      |
| Work with Expo CI/CD Workflows | `expo-cicd-workflows`  |
| Work with Expo Deployment      | `expo-deployment`      |
| Work with Expo Dev Client      | `expo-dev-client`      |
| Work with Native Data Fetching | `native-data-fetching` |
| Work with Use DOM              | `use-dom`              |
| Work with Zod                  | `zod-4`                |

---

### Tech Stack

| Component            | Location   | Tech Stack                                                                                                                                                                                                  |
| -------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile App           | `src/`     | Expo SDK 55, React 19, TypeScript (strict), Expo Router, TanStack Query v5, Zustand v5, Zod v4, React Hook Form, Reanimated 4, Gesture Handler, date-fns, expo-secure-store, expo-image, expo-haptics, MMKV |
| Backend (NestJS API) | `none`     | Separate repository                                                                                                                                                                                         |
| Testing              | co-located | Jest + React Testing Library                                                                                                                                                                                |

---

## Path Alias

One alias. Configured in `tsconfig.json`:

```
@/*        → ./src/*
@/assets/* → ./assets/*
```

NEVER use relative paths to go up more than one level. Use `@/` instead.

---

## Project Structure

```
src/
├── app/                          # Routes ONLY (Expo Router)
│   ├── _layout.tsx               # Root layout (providers)
│   ├── +not-found.tsx            # 404 screen
│   ├── (auth)/                   # Auth flow (login, register, forgot)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/                   # Main app (authenticated)
│       ├── _layout.tsx           # NativeTabs
│       ├── (home)/
│       │   ├── _layout.tsx       # Stack
│       │   └── index.tsx
│       ├── (transactions)/
│       │   ├── _layout.tsx       # Stack
│       │   └── index.tsx
│       └── (settings)/
│           ├── _layout.tsx       # Stack
│           └── index.tsx
│
├── features/                     # Feature modules (the core)
│   ├── auth/
│   │   ├── api/                  # API functions (fetch calls)
│   │   ├── components/           # Feature-specific UI
│   │   ├── hooks/                # Feature-specific hooks
│   │   ├── schemas/              # Zod schemas (source of truth)
│   │   └── types.ts              # DERIVED types (z.infer only)
│   ├── transactions/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   └── types.ts
│   ├── accounts/
│   ├── debts/
│   ├── loans/
│   ├── goals/
│   └── frequent-payments/
│
├── components/                   # Shared UI components
│   └── ui/                       # Design system primitives
│
├── hooks/                        # Shared hooks
├── lib/                          # Core utilities
│   ├── api-client.ts             # Fetch wrapper with auth
│   ├── query-client.ts           # TanStack Query config
│   └── storage.ts                # MMKV instance
│
├── stores/                       # Zustand stores (client state ONLY)
│   └── ui-store.ts
│
├── constants/                    # App-wide constants
│   ├── theme.ts
│   └── query-keys.ts             # Query key factory
│
└── types/                        # Global shared types
    └── env.d.ts                  # Environment variable types
```

**Key rules:**

- `app/` contains ONLY route files and `_layout.tsx`. No components, no utils, no types.
- `features/` is where the business logic lives. Each feature is self-contained.
- A feature NEVER imports from another feature. Shared logic goes in `lib/`, `hooks/`, or `components/`.
- Adding a new feature = creating a new folder under `features/`. That's it.

---

### Adding a New Feature (Checklist)

1. Create folder under `features/`
2. Define Zod schemas in `schemas/`
3. Derive types with `z.infer` in `types.ts`
4. Write API functions in `api/`
5. Create query/mutation hooks in `hooks/`
6. Build components in `components/`
7. Add route(s) in `app/`
8. Add query keys to `constants/query-keys.ts`

---

## Type Safety — Zod as Source of Truth

Schemas live in the feature. Types are ALWAYS derived. Never manually write an interface for data that comes from or goes to the API.

```typescript
// features/transactions/schemas/transaction-schema.ts
import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive(),
  createdAt: z.string().datetime(),
});

export const createTransactionSchema = transactionSchema.omit({
  id: true,
  createdAt: true,
});
```

```typescript
// features/transactions/types.ts
import { z } from "zod";
import {
  transactionSchema,
  createTransactionSchema,
} from "@/features/transactions/schemas/transaction-schema";

export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
```

---

## State Management

### Server State — TanStack Query

ALL data from the API lives here. No exceptions.

### Client State — Zustand

ONLY for UI state that has nothing to do with the server: modals, filters, selected tabs, onboarding progress, theme preference.

### Decision Table

| Question                   | Answer                 |
| -------------------------- | ---------------------- |
| Does it come from the API? | TanStack Query         |
| Is it UI-only state?       | Zustand                |
| Is it a form value?        | React Hook Form        |
| Is it sensitive (tokens)?  | expo-secure-store      |
| Is it a user preference?   | Zustand + MMKV persist |

---

## Data Fetching

### API Client

Single fetch wrapper. Handles auth, errors, and base URL.

```typescript
// lib/api-client.ts
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      body.message || "Request failed",
      response.status,
      body.code,
    );
  }

  return response.json();
}
```

### Query Key Factory

Predictable, typed, centralized.

```typescript
// constants/query-keys.ts
export const queryKeys = {
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
  // Same pattern for every feature
} as const;
```

### Query Hook Pattern

```typescript
// features/transactions/hooks/use-transactions.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { getTransactions } from "@/features/transactions/api/transactions-api";
import type { Transaction } from "@/features/transactions/types";

export function useTransactions(filters?: Record<string, unknown>) {
  return useQuery<Transaction[]>({
    queryKey: filters
      ? queryKeys.transactions.list(filters)
      : queryKeys.transactions.lists(),
    queryFn: () => getTransactions(filters),
  });
}
```

### Mutation with Optimistic Update

```typescript
// features/transactions/hooks/use-create-transaction.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { createTransaction } from "@/features/transactions/api/transactions-api";
import type {
  Transaction,
  CreateTransaction,
} from "@/features/transactions/types";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransaction) => createTransaction(data),
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.transactions.lists(),
      });
      const previous = queryClient.getQueryData<Transaction[]>(
        queryKeys.transactions.lists(),
      );

      queryClient.setQueryData<Transaction[]>(
        queryKeys.transactions.lists(),
        (old = []) => [
          {
            ...newTransaction,
            id: "temp",
            createdAt: new Date().toISOString(),
          } as Transaction,
          ...old,
        ],
      );

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.transactions.lists(),
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}
```

### Query Error Handling

```typescript
// Shared error handler for mutations
function handleMutationError(error: unknown) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // Navigate to login
        break;
      case 422:
        // Return field errors to the form
        break;
      default:
        // Show generic toast
        break;
    }
  }
}
```

---

## Forms

React Hook Form + Zod resolver. One pattern everywhere.

---

## Navigation

### Structure

Expo Router with NativeTabs (SDK 55). Routes live in `src/app/`.

- Root `_layout.tsx` → Providers (QueryClient, Theme, Auth guard)
- `(auth)/_layout.tsx` → Stack for unauthenticated screens
- `(tabs)/_layout.tsx` → NativeTabs for main app
- Each tab group has its own `_layout.tsx` → Stack for navigation within that tab

### Rules

- ALWAYS use `_layout.tsx` to define Stacks
- NEVER co-locate components in `app/` — routes only
- Use group routes `(group)` to organize without affecting URLs
- Set page titles via `Stack.Screen options`, not custom text elements
- Use `ScrollView` with `contentInsetAdjustmentBehavior="automatic"` as first child in every screen

---

## Conventions

### File Naming

All files use `kebab-case`:

- `transaction-card.tsx` — Components
- `use-transactions.ts` — Hooks (`use-` prefix)
- `transaction-schema.ts` — Schemas (`-schema` suffix)
- `transactions-api.ts` — API functions (`-api` suffix)
- `ui-store.ts` — Stores (`-store` suffix)

### Code Conventions

- **Named exports** everywhere. Exception: route files (`app/`) require default exports.
- **No barrel files**. Import from the actual file.
- **No `any`**. Use `unknown` and narrow.
- **No `console.log`** in production.
- **No default exports** in features/components/hooks.
- **Haptics on iOS** for user actions (conditionally with `process.env.EXPO_OS`).

### Import Order

```typescript
// 1. React / React Native
// 2. Third-party libraries
// 3. Internal (@/ alias)
// 4. Types (type-only imports)
```

---

## Error Handling

Consistent everywhere. No `console.log` and pray.
Consistent. Typed. User always gets feedback.

### Error Class

```typescript
// lib/api-client.ts (included in the ApiError class above)
// ApiError has: message, status, code
```

### Error Feedback Strategy

| Scenario                      | Handling                                          |
| ----------------------------- | ------------------------------------------------- |
| Network error (no connection) | Banner/toast: "No internet connection"            |
| 401 Unauthorized              | Redirect to login, clear tokens                   |
| 403 Forbidden                 | Toast: "You don't have access to this"            |
| 404 Not Found                 | Show empty state in the screen                    |
| 422 Validation                | Show field-level errors in the form               |
| 429 Rate Limit                | Toast: "Too many requests. Try again in a moment" |
| 500+ Server Error             | Toast: "Something went wrong. Try again"          |
| Mutation failure              | Revert optimistic update + toast with error       |
| Query failure                 | Error state in the component with retry button    |

### Error Boundaries

Wrap feature sections. If a screen crashes → "Something went wrong" + retry. Never a white screen.

### Query Error Handling

Typed `ApiError` class with `status` and `code`. Switch on status for appropriate UX response.

---

## Security

Finance app. Security is NOT optional.

| Area                  | Implementation                                                                    |
| --------------------- | --------------------------------------------------------------------------------- |
| Token storage         | `expo-secure-store` — NEVER AsyncStorage, NEVER MMKV                              |
| API communication     | HTTPS only. Certificate pinning in production.                                    |
| Environment variables | Secrets NEVER in `EXPO_PUBLIC_*`. Use API routes for server-side secrets.         |
| Input validation      | Zod on every input. Validate on client AND server.                                |
| Session management    | Token refresh flow with single concurrent refresh.                                |
| Sensitive screens     | Biometric auth prompt (expo-local-authentication) for viewing balances/transfers. |
| Deep linking          | Validate all deep link params before navigation.                                  |
| Data in transit       | No sensitive data in URL params. Use POST body or headers.                        |

---

## Performance

| Strategy       | Implementation                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| React Compiler | Enabled — automatic memoization. Don't manually add `useMemo`/`useCallback` unless profiler shows a problem. |
| List rendering | `FlashList` for long lists. Never `ScrollView` for dynamic data.                                             |
| Images         | `expo-image` (built-in caching, blurhash placeholders).                                                      |
| Query caching  | `staleTime: 5min` prevents unnecessary refetches.                                                            |
| Bundle size    | `date-fns` (tree-shakeable). No moment.js. No lodash (use native methods).                                   |
| Animations     | Reanimated (runs on UI thread). No Animated API.                                                             |
| Navigation     | Native stacks and tabs — no JS-based navigation.                                                             |
| Fonts          | Load at splash screen, not at runtime.                                                                       |

---

## Testing

Pragmatic. Test behavior, not implementation.

### Strategy

| Type        | What to Test                                           | Tool                         |
| ----------- | ------------------------------------------------------ | ---------------------------- |
| Unit        | Zod schemas, utility functions, pure logic             | Jest                         |
| Integration | Hooks (query + mutation flows), form validation        | Jest + React Testing Library |
| Component   | Critical UI flows (transaction form, account selector) | Jest + React Testing Library |
| E2E         | Happy paths (login → create transaction → verify)      | Maestro (future)             |

### Rules

- Test the **hook**, not the component that uses it (when possible).
- Mock the API layer, not TanStack Query.
- Every Zod schema gets a test: valid data passes, invalid data fails with correct errors.
- No snapshot tests. They break on every change and test nothing meaningful.
- Test file lives next to what it tests: `use-transactions.test.ts` next to `use-transactions.ts`.

---

## Animations

Subtle. Professional. Always providing feedback.

| When              | Animation                 | Library                      |
| ----------------- | ------------------------- | ---------------------------- |
| List item appears | `FadeIn.duration(200)`    | Reanimated entering          |
| List item removed | `FadeOut.duration(150)`   | Reanimated exiting           |
| Screen transition | Native stack animations   | Expo Router                  |
| Button press      | Scale to 0.97 + haptic    | Gesture Handler + Reanimated |
| Success action    | Checkmark with spring     | Reanimated                   |
| Error shake       | Horizontal shake on field | Reanimated                   |
| Layout change     | `Layout.springify()`      | Reanimated layout            |

**Rules**: No animation longer than 300ms. No bouncy springs on data elements. No animations that block user interaction.

---

## Multi-Currency & Internationalization

| Aspect              | Approach                                                             |
| ------------------- | -------------------------------------------------------------------- |
| Currency storage    | Store amount as integer (cents) + ISO 4217 currency code             |
| Display             | Format at render time using `Intl.NumberFormat`                      |
| User preference     | Default currency stored in user profile                              |
| Multiple currencies | Each account has its own currency. Dashboard shows converted totals. |
| Date formatting     | `date-fns` with locale support. Format at render time.               |
| Locale detection    | Device locale as default, overridable in settings.                   |

```typescript
// Currency amounts stored as: { amount: 1599, currency: 'USD' } → $15.99
export function formatCurrency(
  amount: number,
  currency: string,
  locale?: string,
): string {
  return new Intl.NumberFormat(locale ?? "en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}
```

---
