import { z } from "zod";

// ─── Register ────────────────────────────────────────────────────────
export const registerNameSchema = z.object({
  firstName: z
    .string()
    .min(2, { error: "Mínimo 2 caracteres" })
    .max(50, { error: "Máximo 50 caracteres" }),
  lastName: z
    .string()
    .min(2, { error: "Mínimo 2 caracteres" })
    .max(50, { error: "Máximo 50 caracteres" }),
});

export const registerEmailSchema = z.object({
  email: z.email({ error: "Ingresá un email válido" }),
});

export const registerPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "Mínimo 8 caracteres" })
      .max(128, { error: "Máximo 128 caracteres" })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Debe contener al menos una mayúscula",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Debe contener al menos una minúscula",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Debe contener al menos un número",
      }),
    confirmPassword: z.string().min(1, { error: "Confirmá tu contraseña" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
  });

export const registerSchema = z.object({
  email: z.email({ error: "Ingresá un email válido" }),
  password: z
    .string()
    .min(8, { error: "Mínimo 8 caracteres" })
    .max(128, { error: "Máximo 128 caracteres" }),
  firstName: z
    .string()
    .min(2, { error: "Mínimo 2 caracteres" })
    .max(50, { error: "Máximo 50 caracteres" }),
  lastName: z
    .string()
    .min(2, { error: "Mínimo 2 caracteres" })
    .max(50, { error: "Máximo 50 caracteres" }),
});

// ─── Login ───────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.email({ error: "Ingresá un email válido" }),
  password: z.string().min(1, { error: "Ingresá tu contraseña" }),
});

// ─── Verify Email (OTP) ─────────────────────────────────────────────
export const verifyEmailSchema = z.object({
  email: z.email(),
  code: z
    .string()
    .length(6, { error: "El código debe tener 6 dígitos" })
    .refine((val) => /^\d{6}$/.test(val), {
      message: "Solo dígitos numéricos",
    }),
});

// ─── Resend Verification ────────────────────────────────────────────
export const resendVerificationSchema = z.object({
  email: z.email(),
});

// ─── Refresh Token ──────────────────────────────────────────────────
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

// ─── API Response Shapes ────────────────────────────────────────────
export const planSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  emailVerified: z.boolean(),
  status: z.enum(["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED", "DELETED"]),
  createdAt: z.string(),
  plan: planSchema,
});

export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

export const loginResponseSchema = z.object({
  tokens: tokensSchema,
  user: userSchema,
});

export const registerResponseSchema = z.object({
  message: z.string(),
  user: userSchema,
});

export const verifyEmailResponseSchema = z.object({
  message: z.string(),
  tokens: tokensSchema,
  user: userSchema,
});
