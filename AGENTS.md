Facets is a professional finance tracker Saas application. It supports multi-tenant user accounts with features like transaction (e.g Expenses, Incomes) tracking,accounts (e.g debit card, cash),debts management,loans management, goals, and frequent payments and future new features. Available in IOS, Android and Web.

All of this is designed to be scalable, to quickly add new features, to be able to add support for multiple countries and currencies.

We have a pricing system for our SaaS with a free tier and 2 additional plans

## Non-negotiables

- Never use barrel files (index.ts for re-exports)
- Always import directly from the source file, not from an index

## Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                                                                | Skill           |

| --------------------------------------------------------------------- | --------------- |

| Work with Expo | `vercel-react-native-skill` |

| Work in UX UI               | `ui-ux-pro-max` |

### Tech Stack by Components

| Component            | Location | Tech Stack                                                                                                                                                                                                                                                                          |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile App           | `app/`   | Expo (React Native), TanStack Query, Nativewind,React Native Reanimated, zustand, zod, react-hook-form, TanStack Table,@legendapp/list,React Native Gesture Handler,expo-image,@react-navigation/native-stack,zeego,expo-secure-store,@nandorojo/galeria,date-fns,react-native-mmkv |
| Backend (Nestjs API) | `none`   |                                                                                                                                                                                                                                                                                     |
| Testing              | `tests/` | Jest                                                                                                                                                                                                                                                                                |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## Project Structure

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
