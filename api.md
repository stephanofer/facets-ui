# Facets API — Frontend Integration Guide

> **Base URL:** `http://192.168.100.38:3000/api/v1`  
> **All requests/responses:** `Content-Type: application/json`

---

## Índice

1. [Estándar de respuestas](#1-estándar-de-respuestas)
2. [Manejo de errores](#2-manejo-de-errores)
3. [Autenticación — Estrategia de tokens](#3-autenticación--estrategia-de-tokens)
4. [Endpoints de Auth](#4-endpoints-de-auth)
5. [Endpoints de Perfil](#5-endpoints-de-perfil)
6. [Endpoints de Planes y Suscripciones](#6-endpoints-de-planes-y-suscripciones)
7. [Feature Gating](#7-feature-gating)
8. [Referencia de Error Codes](#8-referencia-de-error-codes)

---

## 1. Estándar de respuestas

**Toda** respuesta exitosa viene envuelta en este shape:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-28T12:00:00.000Z",
    "pagination": { ... }
  }
}
```

La propiedad `pagination` solo aparece en endpoints de listas paginadas:

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

> **Regla:** Siempre leer `response.data` para obtener el payload real.

---

## 2. Manejo de errores

**Todo** error sigue este shape:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": []
  },
  "meta": {
    "timestamp": "2026-02-28T12:00:00.000Z",
    "path": "/api/v1/auth/login"
  }
}
```

- `code` — siempre presente, usar para lógica condicional en el frontend
- `message` — descripción legible, se puede mostrar al usuario
- `details` — array opcional, solo en errores de validación o feature limits

### Mapa HTTP Status → Error Code

| HTTP | `error.code`             | Cuándo ocurre                                          |
| ---- | ------------------------ | ------------------------------------------------------ |
| 400  | `VALIDATION_ERROR`       | Body inválido (campos faltantes, formatos incorrectos) |
| 401  | `UNAUTHORIZED`           | Token ausente, inválido o expirado                     |
| 401  | `INVALID_CREDENTIALS`    | Email o contraseña incorrectos                         |
| 401  | `REFRESH_TOKEN_INVALID`  | Refresh token inválido o no encontrado                 |
| 401  | `REFRESH_TOKEN_REVOKED`  | Refresh token ya fue usado/revocado                    |
| 403  | `EMAIL_NOT_VERIFIED`     | Usuario no verificó su email                           |
| 403  | `ACCOUNT_SUSPENDED`      | Cuenta suspendida                                      |
| 403  | `ACCOUNT_DELETED`        | Cuenta eliminada                                       |
| 403  | `FEATURE_NOT_AVAILABLE`  | Feature no incluida en el plan actual                  |
| 403  | `FEATURE_LIMIT_EXCEEDED` | Se alcanzó el límite de uso del plan                   |
| 404  | `RESOURCE_NOT_FOUND`     | Recurso no encontrado                                  |
| 404  | `USER_NOT_FOUND`         | Usuario no encontrado                                  |
| 409  | `EMAIL_ALREADY_EXISTS`   | Email ya registrado                                    |
| 429  | `RATE_LIMIT_EXCEEDED`    | Demasiadas requests                                    |
| 429  | `OTP_MAX_ATTEMPTS`       | Demasiados intentos de OTP                             |
| 429  | `OTP_COOLDOWN`           | Hay que esperar antes de pedir otro OTP                |
| 429  | `OTP_RATE_LIMITED`       | Se superó el límite de OTPs por hora                   |
| 500  | `INTERNAL_ERROR`         | Error del servidor                                     |

### Errores de validación — `details` array

Cuando el body tiene campos inválidos, `details` trae uno por campo:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "message": "Please provide a valid email address" },
      { "message": "Password must be at least 8 characters long" }
    ]
  }
}
```

## 3. Autenticación — Estrategia de tokens

La API soporta **dos estrategias en paralelo**. No son excluyentes — la API acepta ambas.

### Web (cookies HttpOnly)

La API setea automáticamente dos cookies en el browser:

| Cookie         | Contenido      | TTL     |
| -------------- | -------------- | ------- |
| `accessToken`  | JWT de acceso  | ~1 hora |
| `refreshToken` | JWT de refresh | ~7 días |

- Ambas son `HttpOnly`, `Secure`, `SameSite: Strict`
- El browser las envía automáticamente en cada request al mismo dominio
- **No leer las cookies desde JS** — el browser las maneja solo

### Mobile (tokens en body)

Los tokens vienen en el body de la respuesta:

```json
{
  "tokens": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 3600
  }
}
```

- Guardar en **Secure Storage** del dispositivo (Expo SecureStore)
- Enviar el access token como header en cada request:

```
Authorization: Bearer eyJ...
```

- Enviar el refresh token en el body de `POST /auth/refresh`

### Flujo de refresh de tokens

Cuando una request devuelve `401 UNAUTHORIZED`:

1. Llamar a `POST /auth/refresh` (con el refresh token)
2. Si responde `200` → guardar los nuevos tokens y reintentar la request original
3. Si responde `401` (`REFRESH_TOKEN_INVALID` o `REFRESH_TOKEN_REVOKED`) → logout forzado, redirigir al login

> **Importante:** cada llamada a `/auth/refresh` invalida el token anterior y emite uno nuevo (rotación). Si se detecta uso de un token ya revocado, **todas las sesiones del usuario son invalidadas** (protección contra robo de tokens).

---

## 4. Endpoints de Auth

### `POST /auth/register`

Registra un nuevo usuario. El email queda **sin verificar** hasta completar el paso de OTP.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

| Campo       | Tipo   | Reglas                                                           |
| ----------- | ------ | ---------------------------------------------------------------- |
| `email`     | string | Email válido                                                     |
| `password`  | string | Mín. 8, máx. 128 chars. Debe tener mayúscula, minúscula y número |
| `firstName` | string | Mín. 2, máx. 50 chars                                            |
| `lastName`  | string | Mín. 2, máx. 50 chars                                            |

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "message": "Registration successful. Please check your email to verify your account.",
    "user": {
      "id": "clxxxxxxxxxxxxxxxxxxxxxx",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": false,
      "status": "PENDING_VERIFICATION",
      "createdAt": "2026-02-28T12:00:00.000Z",
      "plan": { "code": "free", "name": "Free" }
    }
  },
  "meta": { "timestamp": "2026-02-28T12:00:00.000Z" }
}
```

**Errores posibles:**

| Code                   | Status | Acción sugerida                      |
| ---------------------- | ------ | ------------------------------------ |
| `VALIDATION_ERROR`     | 400    | Mostrar mensajes del array `details` |
| `EMAIL_ALREADY_EXISTS` | 409    | "Este email ya está registrado"      |
| `RATE_LIMIT_EXCEEDED`  | 429    | Deshabilitar botón y esperar         |

---

### `POST /auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 3600
    },
    "user": {
      "id": "clxxxxxxxxxxxxxxxxxxxxxx",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": true,
      "status": "ACTIVE",
      "createdAt": "2026-02-28T12:00:00.000Z",
      "plan": { "code": "free", "name": "Free" }
    }
  },
  "meta": { "timestamp": "2026-02-28T12:00:00.000Z" }
}
```

**Errores posibles:**

| Code                  | Status | Acción sugerida                                   |
| --------------------- | ------ | ------------------------------------------------- |
| `VALIDATION_ERROR`    | 400    | Mostrar errores en los campos                     |
| `INVALID_CREDENTIALS` | 401    | "Email o contraseña incorrectos"                  |
| `EMAIL_NOT_VERIFIED`  | 403    | Redirigir al flujo de verificación de email       |
| `ACCOUNT_SUSPENDED`   | 403    | "Tu cuenta ha sido suspendida. Contactá soporte." |
| `ACCOUNT_DELETED`     | 403    | "Esta cuenta ya no existe."                       |
| `RATE_LIMIT_EXCEEDED` | 429    | Deshabilitar botón temporalmente                  |

---

### Flujo de verificación de email

Después del registro (o cuando el login devuelve `EMAIL_NOT_VERIFIED`), el usuario recibe un código de 6 dígitos por email.

#### `POST /auth/verify-email`

Verifica el código y **loguea automáticamente** al usuario (devuelve tokens).

**Request:**

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

| Campo   | Tipo   | Reglas                          |
| ------- | ------ | ------------------------------- |
| `email` | string | Email válido                    |
| `code`  | string | Exactamente 6 dígitos numéricos |

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully. You are now logged in.",
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 3600
    },
    "user": { ... }
  }
}
```

**Errores posibles:**

| Code                     | Status | Acción sugerida                                             |
| ------------------------ | ------ | ----------------------------------------------------------- |
| `INVALID_OTP`            | 400    | "Código incorrecto" (el mensaje incluye intentos restantes) |
| `OTP_EXPIRED`            | 400    | "El código expiró, pedí uno nuevo"                          |
| `EMAIL_ALREADY_VERIFIED` | 400    | Redirigir al login                                          |
| `USER_NOT_FOUND`         | 404    | Error inesperado                                            |
| `OTP_MAX_ATTEMPTS`       | 429    | "Demasiados intentos. Pedí un nuevo código."                |

#### `POST /auth/resend-verification`

Reenvía el código de verificación.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "message": "If an account exists with this email, a verification code has been sent."
  }
}
```

> **Nota:** La respuesta es siempre la misma haya o no haya una cuenta con ese email (anti-enumeración).

**Errores posibles:**

| Code                     | Status | Acción sugerida                                               |
| ------------------------ | ------ | ------------------------------------------------------------- |
| `EMAIL_ALREADY_VERIFIED` | 400    | Redirigir al login                                            |
| `OTP_COOLDOWN`           | 429    | El mensaje incluye los segundos restantes. Mostrar countdown. |
| `OTP_RATE_LIMITED`       | 429    | "Superaste el límite de intentos por hora."                   |

---

### Flujo de reset de contraseña

#### `POST /auth/forgot-password`

Envía un código de reset por email.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "message": "If an account exists with this email, a password reset code has been sent."
  }
}
```

> La respuesta es siempre la misma (anti-enumeración). No revelar si el email existe o no.

---

#### `POST /auth/reset-password`

Aplica la nueva contraseña usando el código recibido.

**Request:**

```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewPassword123"
}
```

| Campo         | Tipo   | Reglas                                                     |
| ------------- | ------ | ---------------------------------------------------------- |
| `email`       | string | Email válido                                               |
| `code`        | string | Exactamente 6 dígitos numéricos                            |
| `newPassword` | string | Mín. 8, máx. 128. Debe tener mayúscula, minúscula y número |

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "message": "Password has been reset successfully. Please login with your new password."
  }
}
```

> Después de un reset exitoso, **todas las sesiones activas del usuario son invalidadas**. Redirigir al login.

**Errores posibles:**

| Code               | Status | Acción sugerida                              |
| ------------------ | ------ | -------------------------------------------- |
| `INVALID_OTP`      | 400    | "Código incorrecto"                          |
| `OTP_EXPIRED`      | 400    | "El código expiró, pedí uno nuevo"           |
| `OTP_MAX_ATTEMPTS` | 429    | "Demasiados intentos. Pedí un nuevo código." |

---

### `POST /auth/refresh`

Rota los tokens. **No requiere access token válido** — usa el refresh token.

**Web:** No enviar body, la cookie se envía automáticamente.

**Mobile — Request:**

```json
{
  "refreshToken": "eyJ..."
}
```

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 3600
  }
}
```

**Errores posibles:**

| Code                    | Status | Acción sugerida                      |
| ----------------------- | ------ | ------------------------------------ |
| `REFRESH_TOKEN_INVALID` | 401    | Logout forzado → login               |
| `REFRESH_TOKEN_REVOKED` | 401    | Logout forzado → login               |
| `EMAIL_NOT_VERIFIED`    | 403    | Redirigir a verificación             |
| `ACCOUNT_SUSPENDED`     | 403    | Mostrar mensaje de cuenta suspendida |

---

### `POST /auth/logout`

Cierra la sesión del dispositivo actual. Requiere access token válido.

**Web:** No enviar body.

**Mobile — Request:**

```json
{
  "refreshToken": "eyJ..."
}
```

**Response `200`:**

```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

> Es idempotente — siempre devuelve `200` aunque ya estuviera deslogueado.

## 5. Endpoints de Perfil

### `GET /auth/me`

Devuelve el perfil del usuario autenticado. Requiere access token válido.

> No hace un DB query extra — el usuario ya fue cargado durante la validación del JWT.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": "clxxxxxxxxxxxxxxxxxxxxxx",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true,
    "status": "ACTIVE",
    "createdAt": "2026-02-28T12:00:00.000Z",
    "plan": {
      "code": "free",
      "name": "Free"
    }
  },
  "meta": { "timestamp": "2026-02-28T12:00:00.000Z" }
}
```

**Posibles valores de `status`:**

| Valor                  | Significado                     |
| ---------------------- | ------------------------------- |
| `PENDING_VERIFICATION` | Registrado, email no verificado |
| `ACTIVE`               | Cuenta activa y normal          |
| `SUSPENDED`            | Cuenta suspendida               |
| `DELETED`              | Cuenta eliminada (soft delete)  |

**Errores posibles:**

| Code           | Status | Acción sugerida                                     |
| -------------- | ------ | --------------------------------------------------- |
| `UNAUTHORIZED` | 401    | Token expirado → intentar refresh → si falla, login |

---

## 6. Endpoints de Planes y Suscripciones

### Planes (públicos — sin autenticación)

#### `GET /plans`

Lista todos los planes disponibles.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "clxxxxxx",
        "code": "free",
        "name": "Free",
        "description": "Para empezar a organizar tus finanzas",
        "priceMonthly": 0,
        "priceYearly": 0,
        "priceCurrency": "USD",
        "isDefault": true,
        "sortOrder": 1,
        "features": [
          {
            "featureCode": "accounts",
            "limitType": "COUNT",
            "limitValue": 3,
            "featureType": "RESOURCE"
          },
          {
            "featureCode": "transactions_per_month",
            "limitType": "COUNT",
            "limitValue": 50,
            "featureType": "CONSUMABLE",
            "limitPeriod": "MONTHLY"
          },
          {
            "featureCode": "advanced_reports",
            "limitType": "BOOLEAN",
            "limitValue": 0
          }
        ]
      }
    ]
  }
}
```

**Interpretación de `limitValue`:**

| `limitType` | `limitValue` | Significa             |
| ----------- | ------------ | --------------------- |
| `UNLIMITED` | -1           | Sin límite            |
| `BOOLEAN`   | 0            | Feature deshabilitada |
| `BOOLEAN`   | 1            | Feature habilitada    |
| `COUNT`     | n            | Límite de n unidades  |

---

#### `GET /plans/:code`

Detalle de un plan por código (ej: `free`, `pro`, `premium`).

**Response `200`:** Mismo shape que un ítem del array de `GET /plans`.

**Errores posibles:**

| Code                 | Status |
| -------------------- | ------ |
| `RESOURCE_NOT_FOUND` | 404    |

---

### Suscripciones (requieren autenticación)

#### `GET /subscriptions/current`

Suscripción activa del usuario.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "clxxxxxx",
      "status": "ACTIVE",
      "currentPeriodStart": "2026-02-01T00:00:00.000Z",
      "currentPeriodEnd": "2026-03-01T00:00:00.000Z",
      "trialStart": null,
      "trialEnd": null,
      "plan": { ... }
    }
  }
}
```

---

#### `GET /subscriptions/usage`

Uso actual del usuario contra los límites de su plan.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "planCode": "free",
    "planName": "Free",
    "features": [
      {
        "featureCode": "transactions_per_month",
        "current": 23,
        "limit": 50,
        "limitType": "COUNT",
        "featureType": "CONSUMABLE",
        "periodType": "MONTHLY",
        "periodEnd": "2026-03-01T00:00:00.000Z",
        "usagePercentage": 46,
        "limitReached": false
      },
      {
        "featureCode": "advanced_reports",
        "current": 0,
        "limit": 0,
        "limitType": "BOOLEAN",
        "featureType": "BOOLEAN",
        "usagePercentage": 0,
        "limitReached": true
      }
    ]
  }
}
```

> Usar `usagePercentage` para progress bars. Usar `limitReached: true` para mostrar prompts de upgrade.

---

#### `GET /subscriptions/preview?planCode=pro`

Preview de lo que implicaría cambiar al plan `planCode`.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "preview": {
      "currentPlan": { ... },
      "targetPlan": { ... },
      "changeType": "UPGRADE",
      "immediate": true,
      "effectiveAt": null,
      "prorationAmount": 8.50,
      "overages": [],
      "hasOverages": false,
      "gracePeriodEnd": null
    }
  }
}
```

> Si `hasOverages: true`, mostrar advertencia con la lista de `overages` antes de confirmar.
