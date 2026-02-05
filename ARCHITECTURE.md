# Facets - Arquitectura de la Aplicacion

> **Version:** 1.0.0  
> **Ultima actualizacion:** Febrero 2026  
> **Plataformas:** iOS, Android, Web

---

## Tabla de Contenidos

1. [Vision General](#1-vision-general)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Estructura de Carpetas](#3-estructura-de-carpetas)
4. [Gestion de Estado](#4-gestion-de-estado)
5. [Comunicacion con la API](#5-comunicacion-con-la-api)
6. [Navegacion](#6-navegacion)
7. [Sistema de Diseno (UI/UX)](#7-sistema-de-diseno-uiux)
8. [Rendimiento](#8-rendimiento)
9. [Seguridad](#9-seguridad)
10. [Testing](#10-testing)
11. [Convenciones y Buenas Practicas](#11-convenciones-y-buenas-practicas)
12. [Librerias y Justificacion](#12-librerias-y-justificacion)
13. [Escalabilidad](#13-escalabilidad)

---

## 1. Vision General

### Que es Facets?

Facets es una aplicacion SaaS de finanzas personales multi-tenant que permite:

- Seguimiento de transacciones (gastos, ingresos)
- Gestion de cuentas (tarjetas, efectivo, etc.)
- Manejo de deudas y prestamos
- Metas financieras
- Pagos frecuentes/recurrentes
- Soporte multi-pais y multi-moneda

### Principios de Arquitectura

| Principio          | Descripcion                                   |
| ------------------ | --------------------------------------------- |
| **Escalabilidad**  | Agregar features sin refactorizar la base     |
| **Simplicidad**    | Codigo legible, sin sobre-ingenieria          |
| **Performance**    | 60fps, carga rapida, memoria optimizada       |
| **Mantenibilidad** | Facil de entender para nuevos desarrolladores |
| **Consistencia**   | Patrones uniformes en toda la app             |

### Non-Negotiables

```
- NUNCA usar barrel files (index.ts para re-exports)
- SIEMPRE importar directamente desde el archivo fuente
- NUNCA usar TouchableOpacity (usar Pressable)
- SIEMPRE usar expo-image en lugar de Image de RN
```

---

## 2. Stack Tecnologico

### Core

| Tecnologia       | Version | Proposito               |
| ---------------- | ------- | ----------------------- |
| **Expo**         | ~54.x   | Framework de desarrollo |
| **React Native** | 0.81.x  | Framework base          |
| **React**        | 19.x    | UI Library              |
| **TypeScript**   | ~5.9.x  | Type safety             |

### Estado y Data Fetching

| Libreria           | Proposito                             | Por que?                                          |
| ------------------ | ------------------------------------- | ------------------------------------------------- |
| **TanStack Query** | Server state, caching, sincronizacion | Cache automatico, optimistic updates, retry logic |
| **Zustand**        | Client state (UI, preferencias)       | Simple, performante, selectores granulares        |

### UI y Animaciones

| Libreria                         | Proposito                      |
| -------------------------------- | ------------------------------ |
| **Nativewind**                   | Estilos con Tailwind syntax    |
| **React Native Reanimated**      | Animaciones GPU-accelerated    |
| **React Native Gesture Handler** | Gestos nativos                 |
| **expo-image**                   | Imagenes optimizadas con cache |

### Formularios y Validacion

| Libreria            | Proposito                         |
| ------------------- | --------------------------------- |
| **react-hook-form** | Manejo de formularios performante |
| **zod**             | Validacion de schemas y tipos     |

### Listas y Tablas

| Libreria            | Proposito                               |
| ------------------- | --------------------------------------- |
| **@legendapp/list** | Listas virtualizadas performantes       |
| **TanStack Table**  | Tablas complejas con sorting, filtering |

### Navegacion

| Libreria                           | Proposito          |
| ---------------------------------- | ------------------ |
| **expo-router**                    | File-based routing |
| **@react-navigation/native-stack** | Navegacion nativa  |

### Utilidades Adicionales Recomendadas

| Libreria               | Proposito                         | Razon                           |
| ---------------------- | --------------------------------- | ------------------------------- |
| **zeego**              | Menus nativos (dropdown, context) | UX nativo, accesibilidad        |
| **expo-secure-store**  | Storage seguro para tokens        | Keychain/Keystore nativo        |
| **@nandorojo/galeria** | Galerias con lightbox             | Shared element transitions      |
| **date-fns**           | Manejo de fechas                  | Ligero, tree-shakeable          |
| **react-native-mmkv**  | Storage local ultra-rapido        | 30x mas rapido que AsyncStorage |

---

## 3. Estructura de Carpetas

```
facets/ui/
├── app/                          # Expo Router - Screens y navegacion
│   ├── (auth)/                   # Grupo de rutas de autenticacion
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # Tab navigator principal
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Dashboard/Home
│   │   ├── transactions.tsx
│   │   ├── accounts.tsx
│   │   └── settings.tsx
│   ├── (stack)/                  # Pantallas modales/stack
│   │   ├── transaction/
│   │   │   ├── [id].tsx          # Detalle de transaccion
│   │   │   └── new.tsx           # Nueva transaccion
│   │   ├── account/
│   │   │   ├── [id].tsx
│   │   │   └── new.tsx
│   │   └── ...
│   ├── _layout.tsx               # Root layout
│   └── modal.tsx                 # Modal global
│
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Primitivos del design system
│   │   ├── button.tsx
│   │   ├── text.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── icon-symbol.tsx
│   │   └── ...
│   ├── forms/                    # Componentes de formulario
│   │   ├── form-field.tsx
│   │   ├── currency-input.tsx
│   │   ├── date-picker.tsx
│   │   └── ...
│   ├── transactions/             # Componentes de transacciones
│   │   ├── transaction-item.tsx
│   │   ├── transaction-list.tsx
│   │   └── transaction-filters.tsx
│   ├── accounts/                 # Componentes de cuentas
│   │   ├── account-card.tsx
│   │   ├── account-selector.tsx
│   │   └── ...
│   └── shared/                   # Componentes compartidos
│       ├── empty-state.tsx
│       ├── loading-skeleton.tsx
│       ├── error-boundary.tsx
│       └── ...
│
├── features/                     # Feature modules (logica de negocio)
│   ├── auth/
│   │   ├── hooks/
│   │   │   ├── use-login.ts
│   │   │   └── use-register.ts
│   │   ├── services/
│   │   │   └── auth-service.ts
│   │   └── schemas/
│   │       └── auth-schemas.ts
│   ├── transactions/
│   │   ├── hooks/
│   │   │   ├── use-transactions.ts
│   │   │   ├── use-create-transaction.ts
│   │   │   └── use-transaction-filters.ts
│   │   ├── services/
│   │   │   └── transaction-service.ts
│   │   ├── schemas/
│   │   │   └── transaction-schemas.ts
│   │   └── types/
│   │       └── transaction-types.ts
│   ├── accounts/
│   ├── debts/
│   ├── goals/
│   └── ...
│
├── stores/                       # Zustand stores (client state)
│   ├── auth-store.ts             # Estado de autenticacion
│   ├── ui-store.ts               # Estado de UI (theme, modals)
│   ├── filters-store.ts          # Filtros activos
│   └── preferences-store.ts      # Preferencias del usuario
│
├── services/                     # Servicios core
│   ├── api/
│   │   ├── api-client.ts         # Cliente HTTP configurado
│   │   ├── api-error.ts          # Manejo de errores
│   │   └── api-types.ts          # Tipos base de API
│   ├── storage/
│   │   ├── secure-storage.ts     # Para tokens
│   │   └── local-storage.ts      # Para datos no sensibles
│   └── analytics/
│       └── analytics-service.ts
│
├── hooks/                        # Hooks globales/utilitarios
│   ├── use-theme-color.ts
│   ├── use-color-scheme.ts
│   ├── use-debounce.ts
│   ├── use-keyboard.ts
│   └── ...
│
├── lib/                          # Utilidades y helpers
│   ├── utils/
│   │   ├── format-currency.ts
│   │   ├── format-date.ts
│   │   └── ...
│   ├── constants/
│   │   ├── api-endpoints.ts
│   │   ├── query-keys.ts
│   │   └── app-constants.ts
│   └── validators/
│       └── common-validators.ts
│
├── constants/                    # Constantes globales
│   └── theme.ts
│
├── types/                        # Tipos globales
│   ├── api.ts
│   ├── navigation.ts
│   └── common.ts
│
├── assets/                       # Assets estaticos
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── tests/                        # Tests
│   ├── unit/
│   ├── integration/
│   └── __mocks__/
│
├── scripts/                      # Scripts de utilidad
│
└── config files...
    ├── app.json
    ├── tsconfig.json
    ├── eslint.config.js
    └── package.json
```

### Principios de Organizacion

1. **Colocacion por Feature**: Logica relacionada junta
2. **Componentes UI separados**: Design system independiente
3. **Services desacoplados**: API client reutilizable
4. **Stores minimos**: Solo client state real

---

## 4. Gestion de Estado

### Separacion de Concerns

```
┌─────────────────────────────────────────────────────────────┐
│                      ESTADO DE LA APP                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────┐    ┌─────────────────────────┐    │
│   │   SERVER STATE      │    │     CLIENT STATE        │    │
│   │   (TanStack Query)  │    │      (Zustand)          │    │
│   ├─────────────────────┤    ├─────────────────────────┤    │
│   │ - Transacciones     │    │ - Theme preference      │    │
│   │ - Cuentas           │    │ - Modal states          │    │
│   │ - Usuario           │    │ - Filter selections     │    │
│   │ - Deudas/Prestamos  │    │ - Form draft data       │    │
│   │ - Metas             │    │ - UI toggles            │    │
│   │ - Suscripcion       │    │ - Navigation state      │    │
│   └─────────────────────┘    └─────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### TanStack Query - Server State

```typescript
// features/transactions/hooks/use-transactions.ts

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { transactionService } from "../services/transaction-service";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

// Query basico
export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, filters],
    queryFn: () => transactionService.getTransactions(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Infinite query para listas largas
export function useTransactionsInfinite(filters: TransactionFilters) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, "infinite", filters],
    queryFn: ({ pageParam = 0 }) =>
      transactionService.getTransactions({ ...filters, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
    maxPages: 10, // Limitar paginas en memoria
  });
}
```

```typescript
// features/transactions/hooks/use-create-transaction.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/transaction-service";
import { QUERY_KEYS } from "@/lib/constants/query-keys";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.createTransaction,

    // Optimistic update
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });

      const previousTransactions = queryClient.getQueryData([
        QUERY_KEYS.TRANSACTIONS,
      ]);

      queryClient.setQueryData(
        [QUERY_KEYS.TRANSACTIONS],
        (old: Transaction[]) => [
          { ...newTransaction, id: "temp-id", status: "pending" },
          ...old,
        ],
      );

      return { previousTransactions };
    },

    onError: (err, newTransaction, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.TRANSACTIONS],
        context?.previousTransactions,
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] }); // Balance changed
    },
  });
}
```

### Zustand - Client State

```typescript
// stores/ui-store.ts

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UIState {
  theme: "light" | "dark" | "system";
  currency: string;
  locale: string;

  // Actions
  setTheme: (theme: UIState["theme"]) => void;
  setCurrency: (currency: string) => void;
  setLocale: (locale: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "system",
      currency: "USD",
      locale: "en-US",

      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "ui-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        currency: state.currency,
        locale: state.locale,
      }),
    },
  ),
);
```

```typescript
// stores/filters-store.ts

import { create } from "zustand";

interface TransactionFilters {
  dateRange: { start: Date; end: Date } | null;
  accountIds: string[];
  categoryIds: string[];
  type: "all" | "income" | "expense";
}

interface FiltersState {
  transactionFilters: TransactionFilters;
  setTransactionFilters: (filters: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: TransactionFilters = {
  dateRange: null,
  accountIds: [],
  categoryIds: [],
  type: "all",
};

export const useFiltersStore = create<FiltersState>((set) => ({
  transactionFilters: defaultFilters,

  setTransactionFilters: (filters) =>
    set((state) => ({
      transactionFilters: { ...state.transactionFilters, ...filters },
    })),

  resetFilters: () => set({ transactionFilters: defaultFilters }),
}));

// Selector granular para evitar re-renders
export const useTransactionType = () =>
  useFiltersStore((s) => s.transactionFilters.type);
```

### Reglas de Estado

| Tipo de Dato         | Donde Guardarlo       | Ejemplo                         |
| -------------------- | --------------------- | ------------------------------- |
| Datos del servidor   | TanStack Query        | Transacciones, cuentas, usuario |
| Preferencias UI      | Zustand + persist     | Theme, locale, currency         |
| Estado de formulario | react-hook-form       | Campos de input                 |
| Estado temporal UI   | Zustand (sin persist) | Modal abierto, tab activo       |
| Estado derivado      | Calcular en render    | Total de balance                |

---

## 5. Comunicacion con la API

### Estructura del API Client

```typescript
// services/api/api-client.ts

import { secureStorage } from "../storage/secure-storage";
import { ApiError } from "./api-error";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await secureStorage.getAccessToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.message, error.code);
    }
    return response.json();
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const headers = config?.skipAuth ? {} : await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...config?.headers,
      },
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const headers = config?.skipAuth ? {} : await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    data: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const headers = config?.skipAuth ? {} : await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...config?.headers,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const headers = config?.skipAuth ? {} : await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...config?.headers,
      },
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
```

### Service Layer Pattern

```typescript
// features/transactions/services/transaction-service.ts

import { apiClient } from "@/services/api/api-client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type {
  Transaction,
  CreateTransactionDTO,
  TransactionFilters,
  PaginatedResponse,
} from "../types/transaction-types";

export const transactionService = {
  async getTransactions(
    filters: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();

    if (filters.cursor) params.set("cursor", String(filters.cursor));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.accountIds?.length)
      params.set("accountIds", filters.accountIds.join(","));

    const query = params.toString();
    const endpoint = query
      ? `${API_ENDPOINTS.TRANSACTIONS}?${query}`
      : API_ENDPOINTS.TRANSACTIONS;

    return apiClient.get(endpoint);
  },

  async getTransaction(id: string): Promise<Transaction> {
    return apiClient.get(`${API_ENDPOINTS.TRANSACTIONS}/${id}`);
  },

  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    return apiClient.post(API_ENDPOINTS.TRANSACTIONS, data);
  },

  async updateTransaction(
    id: string,
    data: Partial<CreateTransactionDTO>,
  ): Promise<Transaction> {
    return apiClient.put(`${API_ENDPOINTS.TRANSACTIONS}/${id}`, data);
  },

  async deleteTransaction(id: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.TRANSACTIONS}/${id}`);
  },
};
```

### Query Keys Centralizadas

```typescript
// lib/constants/query-keys.ts

export const QUERY_KEYS = {
  // Auth
  USER: "user",
  SESSION: "session",

  // Transactions
  TRANSACTIONS: "transactions",
  TRANSACTION_DETAIL: "transaction-detail",
  TRANSACTION_STATS: "transaction-stats",

  // Accounts
  ACCOUNTS: "accounts",
  ACCOUNT_DETAIL: "account-detail",
  ACCOUNT_BALANCE: "account-balance",

  // Debts
  DEBTS: "debts",
  DEBT_DETAIL: "debt-detail",

  // Goals
  GOALS: "goals",
  GOAL_DETAIL: "goal-detail",

  // Settings
  CATEGORIES: "categories",
  SUBSCRIPTION: "subscription",
} as const;
```

### Configuracion de Query Client

```typescript
// app/_layout.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos (antes cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // RN no tiene "window focus"
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  )
}
```

---

## 6. Navegacion

### Estructura de Rutas con Expo Router

```
app/
├── _layout.tsx                 # Root - Providers, auth check
├── (auth)/                     # Auth flow (no autenticado)
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (app)/                      # App principal (autenticado)
│   ├── _layout.tsx             # Stack navigator
│   ├── (tabs)/                 # Tab navigator
│   │   ├── _layout.tsx
│   │   ├── index.tsx           # Home/Dashboard
│   │   ├── transactions.tsx
│   │   ├── accounts.tsx
│   │   └── settings.tsx
│   └── (modals)/               # Screens modales
│       ├── _layout.tsx
│       ├── new-transaction.tsx
│       ├── new-account.tsx
│       └── ...
└── +not-found.tsx
```

### Root Layout con Auth Protection

```typescript
// app/_layout.tsx

import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { useRouter, useSegments } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useAuthStore } from '@/stores/auth-store'
import { queryClient } from '@/lib/query-client'

function AuthProtection({ children }: { children: React.ReactNode }) {
  const segments = useSegments()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/(tabs)')
    }
  }, [isAuthenticated, segments, isLoading])

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProtection>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </AuthProtection>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
```

### Tab Layout Nativo

```typescript
// app/(app)/(tabs)/_layout.tsx

import { Tabs } from 'expo-router'
import { IconSymbol } from '@/components/ui/icon-symbol'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <IconSymbol name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Accounts',
          tabBarIcon: ({ color }) => <IconSymbol name="creditcard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol name="gear" color={color} />,
        }}
      />
    </Tabs>
  )
}
```

### Modal Navigation

```typescript
// app/(app)/(modals)/_layout.tsx

import { Stack } from 'expo-router'

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'formSheet',
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="new-transaction"
        options={{
          title: 'New Transaction',
          sheetAllowedDetents: 'fitToContents',
        }}
      />
      <Stack.Screen
        name="new-account"
        options={{ title: 'New Account' }}
      />
    </Stack>
  )
}
```

### Navegacion Type-Safe

```typescript
// types/navigation.ts

export type AppRoutes = {
  "/(auth)/login": undefined;
  "/(auth)/register": undefined;
  "/(app)/(tabs)": undefined;
  "/(app)/(tabs)/transactions": undefined;
  "/(app)/(modals)/new-transaction": { type?: "income" | "expense" };
  "/(app)/transaction/[id]": { id: string };
};

// Uso con tipo inferido
import { useRouter } from "expo-router";

const router = useRouter();
router.push({
  pathname: "/(app)/transaction/[id]",
  params: { id: "123" },
});
```

---

## 7. Sistema de Diseno (UI/UX)

### Tokens de Diseno

```typescript
// constants/theme.ts

export const colors = {
  // Brand
  primary: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
  },

  // Semantic
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",

  // Neutral
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Finance specific
  income: "#22C55E",
  expense: "#EF4444",
  transfer: "#6366F1",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  // Usar fontWeight y color para jerarquia, no muchos tamanos
  sizes: {
    xs: 12,
    sm: 14,
    base: 16, // Minimo para body en mobile
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};
```

### Patrones de Componentes

#### Button con Compound Components

```typescript
// components/ui/button.tsx

import { Pressable, Text, View, StyleSheet } from 'react-native'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onPress?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {children}
    </Pressable>
  )
}

export function ButtonText({ children }: { children: string }) {
  return <Text style={styles.text}>{children}</Text>
}

export function ButtonIcon({ children }: { children: ReactNode }) {
  return <View style={styles.icon}>{children}</View>
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  primary: {
    backgroundColor: '#6366F1',
  },
  secondary: {
    backgroundColor: '#E5E7EB',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  size_sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  size_md: {
    height: 44, // Minimo 44px para touch targets
    paddingHorizontal: 16,
  },
  size_lg: {
    height: 52,
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 4,
  },
})

// Uso:
// <Button onPress={handleSave}>
//   <ButtonIcon><SaveIcon /></ButtonIcon>
//   <ButtonText>Save</ButtonText>
// </Button>
```

#### Input con Form Integration

```typescript
// components/forms/form-input.tsx

import { View, TextInput, Text, StyleSheet } from 'react-native'
import { useController, Control } from 'react-hook-form'

interface FormInputProps {
  name: string
  control: Control<any>
  label: string
  placeholder?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'decimal-pad'
}

export function FormInput({
  name,
  control,
  label,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
}: FormInputProps) {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({ name, control })

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
})
```

### Principios de UX para Finanzas

| Principio                 | Implementacion                                      |
| ------------------------- | --------------------------------------------------- |
| **Claridad en numeros**   | Usar formateador de moneda consistente              |
| **Feedback inmediato**    | Optimistic updates + skeleton loading               |
| **Prevencion de errores** | Validacion en tiempo real, confirmacion de eliminar |
| **Color semantico**       | Verde = ingreso, Rojo = gasto                       |
| **Jerarquia visual**      | Balance grande, detalles secundarios                |
| **Touch targets**         | Minimo 44x44px en todos los botones                 |

### Accesibilidad Checklist

- [ ] Contraste minimo 4.5:1 para texto
- [ ] Labels en todos los inputs
- [ ] Feedback haptico en acciones importantes
- [ ] `accessibilityLabel` en iconos sin texto
- [ ] `accessibilityRole` en elementos interactivos
- [ ] Soporte para `prefers-reduced-motion`

---

## 8. Rendimiento

### Optimizacion de Listas

```typescript
// components/transactions/transaction-list.tsx

import { LegendList } from '@legendapp/list'
import { TransactionItem } from './transaction-item'
import { memo } from 'react'

interface TransactionListProps {
  transactions: Transaction[]
  onItemPress: (id: string) => void
}

// Componente item memoizado con primitivos
const MemoizedTransactionItem = memo(function TransactionItem({
  id,
  description,
  amount,
  type,
  date,
  onPress,
}: {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  onPress: (id: string) => void
}) {
  return (
    <TransactionItem
      id={id}
      description={description}
      amount={amount}
      type={type}
      date={date}
      onPress={onPress}
    />
  )
})

export function TransactionList({ transactions, onItemPress }: TransactionListProps) {
  // Callback hoisted al nivel del padre
  const handlePress = useCallback((id: string) => {
    onItemPress(id)
  }, [onItemPress])

  return (
    <LegendList
      data={transactions}
      keyExtractor={(item) => item.id}
      estimatedItemSize={72}
      renderItem={({ item }) => (
        // Pasar primitivos, no el objeto completo
        <MemoizedTransactionItem
          id={item.id}
          description={item.description}
          amount={item.amount}
          type={item.type}
          date={item.date}
          onPress={handlePress}
        />
      )}
      recycleItems
      contentInsetAdjustmentBehavior="automatic"
    />
  )
}
```

### Animaciones Performantes

```typescript
// Animate SOLO transform y opacity (GPU-accelerated)

// INCORRECTO - trigger layout every frame
const animatedStyle = useAnimatedStyle(() => ({
  height: withTiming(expanded ? 200 : 0), // MAL
}));

// CORRECTO - GPU accelerated
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scaleY: withTiming(expanded ? 1 : 0) }],
  opacity: withTiming(expanded ? 1 : 0),
}));
```

### Evitar Re-renders

```typescript
// Store state represents ground truth
const pressed = useSharedValue(0); // 0 or 1, not visual values

// Derive visual values
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) }],
}));

// Zustand selectors granulares
const currency = useUIStore((s) => s.currency); // Solo re-render si currency cambia
// NO: const { currency, theme, locale } = useUIStore() // Re-render si cualquiera cambia
```

### Imagenes Optimizadas

```typescript
// SIEMPRE usar expo-image
import { Image } from 'expo-image'

<Image
  source={{ uri: `${imageUrl}?w=200&h=200` }} // Tamano apropiado
  placeholder={{ blurhash: item.blurhash }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
  recyclingKey={item.id} // Para listas
  style={styles.image}
/>
```

### Formatters Hoisted

```typescript
// lib/utils/format-currency.ts

// Crear UNA VEZ a nivel de modulo
const currencyFormatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(amount: number, currency: string): string {
  if (!currencyFormatters.has(currency)) {
    currencyFormatters.set(
      currency,
      new Intl.NumberFormat("en-US", { style: "currency", currency }),
    );
  }
  return currencyFormatters.get(currency)!.format(amount);
}

// NO crear new Intl.NumberFormat() en cada render
```

---

## 9. Seguridad

### Almacenamiento Seguro

```typescript
// services/storage/secure-storage.ts

import * as SecureStore from "expo-secure-store";

const KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_ID: "user_id",
};

export const secureStorage = {
  async setAccessToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
  },

  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.USER_ID),
    ]);
  },
};
```

### Validacion con Zod

```typescript
// features/auth/schemas/auth-schemas.ts

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema
  .extend({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

```typescript
// features/transactions/schemas/transaction-schemas.ts

import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(999999999, "Amount too large"),
  type: z.enum(["income", "expense"]),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description too long"),
  accountId: z.string().uuid("Invalid account"),
  categoryId: z.string().uuid("Invalid category").optional(),
  date: z.date(),
  notes: z.string().max(1000).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
```

### Manejo de Errores

```typescript
// services/api/api-error.ts

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isServerError(): boolean {
    return this.status >= 500
  }
}

// En componentes
function TransactionDetail({ id }: { id: string }) {
  const { data, error, isLoading } = useTransaction(id)

  if (error instanceof ApiError) {
    if (error.isNotFound) {
      return <NotFoundScreen />
    }
    if (error.isUnauthorized) {
      // Redirect to login
      return null
    }
  }

  // ...
}
```

### Checklist de Seguridad

- [ ] Tokens en SecureStore (NO AsyncStorage)
- [ ] Validar TODOS los inputs con Zod
- [ ] Sanitizar datos antes de mostrar
- [ ] HTTPS en todas las llamadas
- [ ] No guardar datos sensibles en logs
- [ ] Timeout en sesiones inactivas
- [ ] Rate limiting awareness
- [ ] Certificatte pinning (produccion)

---

## 10. Testing

### Estructura de Tests

```
tests/
├── unit/
│   ├── utils/
│   │   └── format-currency.test.ts
│   ├── hooks/
│   │   └── use-transactions.test.ts
│   └── components/
│       └── transaction-item.test.tsx
├── integration/
│   ├── flows/
│   │   └── create-transaction.test.tsx
│   └── api/
│       └── transaction-service.test.ts
└── __mocks__/
    ├── @react-native-async-storage/
    └── expo-secure-store.ts
```

### Ejemplo de Test de Hook

```typescript
// tests/unit/hooks/use-transactions.test.ts

import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTransactions } from '@/features/transactions/hooks/use-transactions'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useTransactions', () => {
  it('fetches transactions successfully', async () => {
    const { result } = renderHook(
      () => useTransactions({ type: 'all' }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toHaveLength(10)
  })
})
```

### Ejemplo de Test de Componente

```typescript
// tests/unit/components/transaction-item.test.tsx

import { render, fireEvent } from '@testing-library/react-native'
import { TransactionItem } from '@/components/transactions/transaction-item'

describe('TransactionItem', () => {
  const mockTransaction = {
    id: '1',
    description: 'Groceries',
    amount: 50.00,
    type: 'expense' as const,
    date: '2026-02-05',
  }

  it('renders transaction details correctly', () => {
    const { getByText } = render(
      <TransactionItem {...mockTransaction} onPress={jest.fn()} />
    )

    expect(getByText('Groceries')).toBeTruthy()
    expect(getByText('$50.00')).toBeTruthy()
  })

  it('calls onPress with id when pressed', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <TransactionItem {...mockTransaction} onPress={onPress} />
    )

    fireEvent.press(getByTestId('transaction-item'))
    expect(onPress).toHaveBeenCalledWith('1')
  })
})
```

---

## 11. Convenciones y Buenas Practicas

### Naming Conventions

| Tipo             | Convention                 | Ejemplo                             |
| ---------------- | -------------------------- | ----------------------------------- |
| Componentes      | PascalCase                 | `TransactionItem.tsx`               |
| Hooks            | camelCase con `use` prefix | `useTransactions.ts`                |
| Utilidades       | camelCase                  | `formatCurrency.ts`                 |
| Constantes       | SCREAMING_SNAKE_CASE       | `QUERY_KEYS`                        |
| Tipos/Interfaces | PascalCase                 | `Transaction`, `TransactionFilters` |
| Archivos         | kebab-case                 | `transaction-item.tsx`              |

### Import Order

```typescript
// 1. React/React Native
import { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";

// 2. Third-party libraries
import { useQuery } from "@tanstack/react-query";
import { LegendList } from "@legendapp/list";

// 3. Internal - absolute imports
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { Button, ButtonText } from "@/components/ui/button";

// 4. Types
import type { Transaction } from "@/features/transactions/types/transaction-types";

// 5. Styles/constants
import { colors, spacing } from "@/constants/theme";
```

### Conditional Rendering Seguro

```typescript
// INCORRECTO - puede crashear
{count && <Text>{count}</Text>}  // Si count=0, crash!
{name && <Text>{name}</Text>}    // Si name="", crash!

// CORRECTO - ternario
{count > 0 ? <Text>{count}</Text> : null}
{name ? <Text>{name}</Text> : null}

// CORRECTO - boolean explicito
{!!count && <Text>{count}</Text>}
{Boolean(name) && <Text>{name}</Text>}

// MEJOR - early return
if (!data) return null
return <View>...</View>
```

### State Patterns

```typescript
// INCORRECTO - estado derivado redundante
const [items, setItems] = useState([]);
const [count, setCount] = useState(0); // Redundante!

useEffect(() => {
  setCount(items.length); // Innecesario
}, [items]);

// CORRECTO - derivar en render
const [items, setItems] = useState([]);
const count = items.length; // Derivado

// INCORRECTO - initialState pierde reactividad
const [value, setValue] = useState(defaultValue);

// CORRECTO - fallback pattern
const [_value, setValue] = useState<string | undefined>(undefined);
const value = _value ?? defaultValue;
```

---

## 12. Librerias y Justificacion

### Por que cada libreria?

| Libreria            | Alternativa                   | Por que elegimos esta?                                |
| ------------------- | ----------------------------- | ----------------------------------------------------- |
| **TanStack Query**  | SWR, Apollo                   | Mejor soporte offline, optimistic updates, devtools   |
| **Zustand**         | Redux, Jotai, MobX            | API minima, selectores granulares, sin boilerplate    |
| **Nativewind**      | StyleSheet, Styled Components | DX de Tailwind, tree-shaking, theming facil           |
| **react-hook-form** | Formik                        | Re-renders minimos, validation con Zod                |
| **zod**             | Yup, Joi                      | TypeScript-first, tree-shakeable, inferencia de tipos |
| **@legendapp/list** | FlatList, FlashList           | Recycling optimizado, mejor con React Compiler        |
| **expo-router**     | React Navigation directo      | File-based, type-safe routes, deep linking automatico |
| **expo-image**      | RN Image, FastImage           | Blurhash, caching, memory efficient                   |

### Librerias a NO usar

| Evitar                     | Razon                   | Alternativa          |
| -------------------------- | ----------------------- | -------------------- |
| `TouchableOpacity`         | API legacy              | `Pressable`          |
| `Image` de RN              | Sin cache, sin blurhash | `expo-image`         |
| `AsyncStorage` para tokens | No es seguro            | `expo-secure-store`  |
| `@react-navigation/stack`  | JS-based, lento         | `native-stack`       |
| Bottom sheet JS libs       | Performance             | `Modal` nativo       |
| `moment.js`                | Huge bundle             | `date-fns` o `dayjs` |

---

## 13. Escalabilidad

### Agregar un Nuevo Feature

1. **Crear carpeta en `features/`**

   ```
   features/
   └── new-feature/
       ├── hooks/
       ├── services/
       ├── schemas/
       └── types/
   ```

2. **Agregar tipos en `types/new-feature-types.ts`**

3. **Crear service en `services/new-feature-service.ts`**

4. **Crear hooks que usen TanStack Query**

5. **Agregar query keys en `lib/constants/query-keys.ts`**

6. **Crear componentes en `components/new-feature/`**

7. **Agregar rutas en `app/`**

### Agregar Soporte Multi-Moneda

El sistema ya esta preparado:

```typescript
// stores/ui-store.ts
currency: "USD"; // Cambiar a cualquier ISO 4217

// lib/utils/format-currency.ts
formatCurrency(amount, currency); // Ya soporta cualquier moneda

// API
// Enviar currency en headers o como parametro
```

### Agregar Nuevo Idioma

```typescript
// 1. Crear archivo de traducciones
locales/
├── en.json
├── es.json
└── pt.json

// 2. Usar libreria como i18next o crear sistema simple
const t = useTranslation()
<Text>{t('transactions.title')}</Text>
```

### Agregar Tier de Suscripcion

```typescript
// types/subscription.ts
type SubscriptionTier = 'free' | 'pro' | 'business'

// features/subscription/hooks/use-subscription.ts
export function useSubscription() {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBSCRIPTION],
    queryFn: subscriptionService.getSubscription,
  })
}

// Componente wrapper para features premium
export function PremiumFeature({
  requiredTier,
  children
}: {
  requiredTier: SubscriptionTier
  children: React.ReactNode
}) {
  const { data: subscription } = useSubscription()

  if (!hasAccess(subscription?.tier, requiredTier)) {
    return <UpgradePrompt tier={requiredTier} />
  }

  return <>{children}</>
}
```

---

## Resumen de Decision Making

### Cuando usar que?

| Situacion               | Solucion                                 |
| ----------------------- | ---------------------------------------- |
| Dato del servidor       | TanStack Query                           |
| Preferencia del usuario | Zustand + persist                        |
| Dato derivado           | Calcular en render                       |
| Estado de form          | react-hook-form                          |
| Validacion              | zod                                      |
| Lista scrolleable       | @legendapp/list                          |
| Imagen                  | expo-image                               |
| Animacion               | Reanimated (transform/opacity)           |
| Modal                   | Modal nativo o presentation: 'formSheet' |
| Menu                    | zeego                                    |

### Checklist Pre-PR

- [ ] No hay barrel files
- [ ] Imports directos desde archivos fuente
- [ ] Componentes de lista memoizados
- [ ] Sin inline objects en renderItem
- [ ] Callbacks hoisted en listas
- [ ] Animaciones usan transform/opacity
- [ ] expo-image para todas las imagenes
- [ ] Validacion con zod
- [ ] Tests para logica critica
- [ ] Touch targets minimo 44px
- [ ] No TouchableOpacity

---

> **Este documento es la fuente de verdad para decisiones de arquitectura en Facets. Cualquier desviacion debe ser discutida y documentada.**
