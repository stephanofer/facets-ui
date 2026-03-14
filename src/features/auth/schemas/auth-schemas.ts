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
export const sessionPlanSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const planSchema = sessionPlanSchema;

export const avatarSchema = z.object({
  id: z.string(),
  url: z.url(),
  mimeType: z.string(),
  size: z.number(),
  purpose: z.literal("AVATAR"),
});

export const workspaceSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  status: z.string(),
});

export const membershipSchema = z.object({
  id: z.string(),
  role: z.string(),
  status: z.string(),
  joinedAt: z.string().optional(),
});

export const workspaceRoleSchema = z.string().min(1);

export const platformRoleSchema = z.string().min(1);

export const canonicalUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  emailVerified: z.boolean(),
  status: z.enum(["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED", "DELETED"]),
  createdAt: z.string(),
  avatar: avatarSchema.nullish(),
});

export const userSchema = canonicalUserSchema;

export const sessionUserSchema = canonicalUserSchema.extend({
  plan: sessionPlanSchema,
  workspace: workspaceSummarySchema,
  membership: membershipSchema,
  workspaceRole: workspaceRoleSchema.optional(),
  platformRole: platformRoleSchema,
});

export const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

export const loginResponseSchema = z.object({
  tokens: tokensSchema,
  user: sessionUserSchema,
});

export const registerResponseSchema = z.object({
  message: z.string(),
  user: sessionUserSchema,
});

export const verifyEmailResponseSchema = z.object({
  tokens: tokensSchema,
  user: sessionUserSchema,
  message: z.string().optional(),
});

export const meResponseSchema = sessionUserSchema;

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export const resendVerificationResponseSchema = z.object({
  message: z.string(),
});

export const canonicalSessionSchema = z.object({
  user: canonicalUserSchema,
  workspace: workspaceSummarySchema,
  membership: membershipSchema,
  workspaceRole: workspaceRoleSchema,
  platformRole: platformRoleSchema,
  plan: sessionPlanSchema,
  source: z.enum(["login", "verify-email", "me"]),
  lastHydratedAt: z.string(),
});
