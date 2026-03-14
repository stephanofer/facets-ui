import type { z } from "zod";

import type {
  currentWorkspaceSchema,
  workspaceSchema,
  workspaceSettingsSchema,
} from "@/features/workspaces/schemas/workspace-schema";

export type Workspace = z.infer<typeof workspaceSchema>;
export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>;
export type CurrentWorkspace = z.infer<typeof currentWorkspaceSchema>;
