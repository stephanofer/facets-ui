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

export const fontFamily = {
  interRegular: "Inter-Regular",
  interMedium: "Inter-Medium",
  interSemibold: "Inter-SemiBold",
  interBold: "Inter-Bold",
  clashMedium: "ClashDisplay-Medium",
  clashSemibold: "ClashDisplay-Semibold",
  debugMonospace: process.env.EXPO_OS === "ios" ? "Menlo" : "monospace",
} as const;

export type TypographyWeight = "regular" | "medium" | "semibold" | "bold";
export type TypographyFamilyRole = "product" | "display";
export type TypographyNumeric = "default" | "tabular";
export type TypographyRole =
  | "default"
  | "brandMark"
  | "avatarInitials"
  | "debugMonospace";

type TypographyVariantConfig = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  defaultFamilyRole: TypographyFamilyRole;
  defaultWeight: TypographyWeight;
  textTransform?: "uppercase";
};

type TypographyRoleConfig = {
  familyRole?: TypographyFamilyRole;
  weight?: TypographyWeight;
  letterSpacing?: number;
  textTransform?: "uppercase";
  fontFamily?: string;
};

export const typography = {
  familyRoles: {
    product: {
      regular: fontFamily.interRegular,
      medium: fontFamily.interMedium,
      semibold: fontFamily.interSemibold,
      bold: fontFamily.interBold,
    },
    display: {
      medium: fontFamily.clashMedium,
      semibold: fontFamily.clashSemibold,
    },
  },
  variants: {
    h1: {
      fontSize: 30,
      lineHeight: 38,
      letterSpacing: -0.6,
      defaultFamilyRole: "product",
      defaultWeight: "bold",
    },
    h2: {
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: -0.4,
      defaultFamilyRole: "product",
      defaultWeight: "bold",
    },
    h3: {
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: -0.25,
      defaultFamilyRole: "product",
      defaultWeight: "bold",
    },
    subtitle: {
      fontSize: 18,
      lineHeight: 26,
      letterSpacing: 0,
      defaultFamilyRole: "product",
      defaultWeight: "medium",
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      defaultFamilyRole: "product",
      defaultWeight: "regular",
    },
    bodyMedium: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
      defaultFamilyRole: "product",
      defaultWeight: "medium",
    },
    label: {
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      defaultFamilyRole: "product",
      defaultWeight: "medium",
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      defaultFamilyRole: "product",
      defaultWeight: "regular",
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.1,
      defaultFamilyRole: "product",
      defaultWeight: "medium",
    },
    eyebrow: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.8,
      defaultFamilyRole: "product",
      defaultWeight: "medium",
      textTransform: "uppercase",
    },
  } satisfies Record<string, TypographyVariantConfig>,
  roles: {
    default: {},
    brandMark: {
      familyRole: "display",
      weight: "semibold",
      letterSpacing: 1.8,
      textTransform: "uppercase",
    },
    avatarInitials: {
      familyRole: "product",
      weight: "semibold",
    },
    debugMonospace: {
      fontFamily: fontFamily.debugMonospace,
    },
  } satisfies Record<TypographyRole, TypographyRoleConfig>,
  native: {
    controlText: {
      fontFamily: fontFamily.interMedium,
      fontSize: 16,
      lineHeight: 24,
    },
    tabLabel: {
      fontFamily: fontFamily.interMedium,
      fontSize: 13,
      lineHeight: 18,
    },
  },
  numeric: {
    default: undefined,
    tabular: ["tabular-nums"],
  },
} as const;

export type TypographyVariant = keyof typeof typography.variants;

const displayWeightMap: Record<TypographyWeight, keyof typeof typography.familyRoles.display> = {
  regular: "medium",
  medium: "medium",
  semibold: "semibold",
  bold: "semibold",
};

export function getFontFamilyForRole(
  role: TypographyFamilyRole,
  weight: TypographyWeight,
) {
  if (role === "display") {
    return typography.familyRoles.display[displayWeightMap[weight]];
  }

  return typography.familyRoles.product[weight];
}

export type ThemeColors = {
  [K in keyof typeof colors.light]: string;
};
export type SemanticColors = typeof semanticColors;
export type SemanticColorKey = keyof SemanticColors;
export type ThemeColorKey = keyof ThemeColors;
export type FontFamily = typeof fontFamily;
export type FontFamilyKey = keyof FontFamily;
