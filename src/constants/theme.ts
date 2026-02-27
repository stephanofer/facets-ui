export const colors = {
  light: {
    primary: "#0D9488",
    secondary: "#7C3AED",
    accent: "#0EA5E9",
    background: "#F8FAFB",
    card: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#94A3B8",
    border: "rgba(0, 0, 0, 0.06)",
  },
  dark: {
    primary: "#5EEACD",
    secondary: "#8B5CF6",
    accent: "#38BDF8",
    background: "#0A0E17",
    card: "#151C2C",
    text: "#F1F5F9",
    textMuted: "#64748B",
    border: "rgba(255, 255, 255, 0.06)",
  },
} as const;

export const semanticColors = {
  income: "#22C55E",
  incomeSoft: "rgba(34, 197, 94, 0.12)",
  expense: "#EF4444",
  expenseSoft: "rgba(239, 68, 68, 0.12)",
  warning: "#F59E0B",
  warningSoft: "rgba(245, 158, 11, 0.12)",
  info: "#3B82F6",
  infoSoft: "rgba(59, 130, 246, 0.12)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
  "4xl": 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 9999,
} as const;

export const fonts = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const;

export type ThemeColors = {
  [K in keyof typeof colors.light]: string;
};
export type SemanticColors = typeof semanticColors;
export type ThemeColorKey = keyof ThemeColors;
