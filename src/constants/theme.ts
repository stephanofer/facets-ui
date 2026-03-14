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
    primary: "#d4ef5c",
    secondary: "#8B5CF6",
    accent: "#38BDF8",
    background: "#000000",
    card: "#151C2C",
    text: "#FFFFFF",
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
export type TypographyFamily = "product" | "display" | "mono";
export type TypographyNumeric = "default" | "tabular";

const typographyFamilyMap = {
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
  mono: {
    regular: fontFamily.debugMonospace,
    medium: fontFamily.debugMonospace,
    semibold: fontFamily.debugMonospace,
    bold: fontFamily.debugMonospace,
  },
} as const;

export const typography = {
  native: {
    controlText: {
      fontFamily: fontFamily.interMedium,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
    },
    tabLabel: {
      fontFamily: fontFamily.interMedium,
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0,
    },
  },
  numeric: {
    default: undefined,
    tabular: ["tabular-nums"] as const,
  },
} as const;

const displayWeightMap: Record<
  TypographyWeight,
  keyof typeof typographyFamilyMap.display
> = {
  regular: "medium",
  medium: "medium",
  semibold: "semibold",
  bold: "semibold",
};

export function resolveTypographyFontFamily(
  family: TypographyFamily,
  weight: TypographyWeight,
) {
  if (family === "display") {
    return typographyFamilyMap.display[displayWeightMap[weight]];
  }

  return typographyFamilyMap[family][weight];
}

export type ThemeColors = {
  [K in keyof typeof colors.light]: string;
};
export type SemanticColors = typeof semanticColors;
export type SemanticColorKey = keyof SemanticColors;
export type ThemeColorKey = keyof ThemeColors;
export type FontFamily = typeof fontFamily;
export type FontFamilyKey = keyof FontFamily;
