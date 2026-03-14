import { ApiError } from "@/lib/api-error";
import {
  showErrorToast,
  showNetworkToast,
  showPermissionToast,
  showServerToast,
  showUnavailableToast,
  showWarningToast,
} from "@/lib/toast";

export type ErrorFeedbackMode = "auto" | "inline" | "screen" | "silent";
export type ErrorFeedbackSource = "query" | "mutation" | "unknown";

export type ErrorFeedbackMeta = {
  errorFeedback?: ErrorFeedbackMode;
};

type ErrorFeedbackPlan = {
  kind: ErrorFeedbackMode;
  status?: number;
};

const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 409, 422, 429]);

export function getErrorFeedbackMode(meta: unknown): ErrorFeedbackMode | undefined {
  if (!meta || typeof meta !== "object") {
    return undefined;
  }

  const value = (meta as ErrorFeedbackMeta).errorFeedback;

  if (
    value === "auto" ||
    value === "inline" ||
    value === "screen" ||
    value === "silent"
  ) {
    return value;
  }

  return undefined;
}

export function shouldRetryQueryError(
  failureCount: number,
  error: unknown,
): boolean {
  if (failureCount >= 2) {
    return false;
  }

  if (!(error instanceof ApiError)) {
    return true;
  }

  if (NON_RETRYABLE_STATUSES.has(error.status)) {
    return false;
  }

  return error.status === 0 || error.status >= 500;
}

function buildFeedbackPlan(
  error: unknown,
  source: ErrorFeedbackSource,
  mode: ErrorFeedbackMode,
): ErrorFeedbackPlan {
  if (mode !== "auto") {
    return { kind: mode };
  }

  if (!(error instanceof ApiError)) {
    return {
      kind: source === "query" ? "screen" : "auto",
    };
  }

  if (error.status === 401) {
    return { kind: "silent", status: error.status };
  }

  if (error.status === 403) {
    return { kind: "auto", status: error.status };
  }

  if (error.status === 404) {
    return {
      kind: source === "query" ? "screen" : "auto",
      status: error.status,
    };
  }

  if ([400, 409, 422, 429].includes(error.status)) {
    return {
      kind: source === "query" ? "screen" : "auto",
      status: error.status,
    };
  }

  if (error.status === 0 || error.status >= 500) {
    return { kind: "auto", status: error.status };
  }

  return {
    kind: source === "query" ? "screen" : "auto",
    status: error.status,
  };
}

export function handleErrorFeedback(
  error: unknown,
  {
    source = "unknown",
    mode = "auto",
  }: {
    source?: ErrorFeedbackSource;
    mode?: ErrorFeedbackMode;
  } = {},
): ErrorFeedbackPlan {
  const plan = buildFeedbackPlan(error, source, mode);

  if (plan.kind !== "auto") {
    return plan;
  }

  if (!(error instanceof ApiError)) {
    showNetworkToast();
    return plan;
  }

  if (error.status === 403) {
    showPermissionToast(error.message);
    return plan;
  }

  if (error.status === 404) {
    showUnavailableToast(error.message);
    return plan;
  }

  if (error.status === 429) {
    showWarningToast("Demasiados intentos", error.message);
    return plan;
  }

  if ([400, 409, 422].includes(error.status)) {
    showErrorToast("No pudimos completar la accion", error.message);
    return plan;
  }

  if (error.status === 0) {
    showNetworkToast(error.message);
    return plan;
  }

  if (error.status >= 500) {
    showServerToast(error.message);
    return plan;
  }

  showErrorToast("Algo salio mal", error.message);
  return plan;
}
