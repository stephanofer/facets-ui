import { canonicalSessionSchema, canonicalUserSchema } from "@/features/auth/schemas/auth-schemas";

import type { CanonicalSession, SessionUser } from "@/features/auth/types";

type SessionSource = CanonicalSession["source"];

export function normalizeSessionUser(
  sessionUser: SessionUser,
  source: SessionSource,
): CanonicalSession {
  const user = canonicalUserSchema.parse({
    id: sessionUser.id,
    email: sessionUser.email,
    firstName: sessionUser.firstName,
    lastName: sessionUser.lastName,
    emailVerified: sessionUser.emailVerified,
    status: sessionUser.status,
    createdAt: sessionUser.createdAt,
    avatar: sessionUser.avatar ?? null,
  });

  return canonicalSessionSchema.parse({
    user,
    workspace: sessionUser.workspace,
    membership: sessionUser.membership,
    workspaceRole: sessionUser.workspaceRole ?? sessionUser.membership.role,
    platformRole: sessionUser.platformRole,
    plan: sessionUser.plan,
    source,
    lastHydratedAt: new Date().toISOString(),
  });
}
