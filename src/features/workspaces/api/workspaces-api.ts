import { apiClient } from "@/lib/api-client";
import {
  currentWorkspaceSchema,
  workspaceSettingsSchema,
} from "@/features/workspaces/schemas/workspace-schema";

import type {
  CurrentWorkspace,
  WorkspaceSettings,
} from "@/features/workspaces/types";

export async function getCurrentWorkspace(): Promise<CurrentWorkspace> {
  const response = await apiClient<unknown>("/workspaces/current");

  return currentWorkspaceSchema.parse(response);
}

export async function getCurrentWorkspaceSettings(): Promise<WorkspaceSettings> {
  const response = await apiClient<unknown>("/workspaces/current/settings");

  return workspaceSettingsSchema.parse(response);
}
