import { forwardRef } from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";

import {
  getFontFamilyForRole,
  semanticColors,
  typography,
} from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

import type { FontVariant, TextProps, TextStyle } from "react-native";
import type {
  SemanticColorKey,
  ThemeColorKey,
  TypographyFamilyRole,
  TypographyNumeric,
  TypographyRole,
  TypographyVariant,
  TypographyWeight,
} from "@/constants/theme";

type ResolvedVariantConfig = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  defaultFamilyRole: TypographyFamilyRole;
  defaultWeight: TypographyWeight;
  textTransform?: TextStyle["textTransform"];
};

type ResolvedRoleConfig = {
  familyRole?: TypographyFamilyRole;
  weight?: TypographyWeight;
  letterSpacing?: number;
  textTransform?: TextStyle["textTransform"];
  fontFamily?: string;
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TypographyProps extends TextProps {
  /** Predefined text style — pick the right one for the context */
  variant?: TypographyVariant;
  /** Override the variant's default font weight */
  weight?: TypographyWeight;
  /** Theme color key, semantic color key, or raw color string */
  color?: ThemeColorKey | SemanticColorKey | (string & {});
  /** Text alignment shorthand */
  align?: "left" | "center" | "right";
  /** Sanctioned family override. Display is ONLY for low-density emphasis surfaces. */
  familyRole?: TypographyFamilyRole;
  /** Approved semantic roles for governed exceptions. */
  textRole?: TypographyRole;
  /** Approved numeric rendering mode. */
  numeric?: TypographyNumeric;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Typography = forwardRef<Text, TypographyProps>(
  function Typography(
    {
      variant = "body",
      weight,
      color,
      align,
      familyRole,
      textRole = "default",
      numeric = "default",
      style,
      children,
      ...props
    },
    ref,
  ) {
    const { colors } = useAppTheme();

    const config = typography.variants[variant] as ResolvedVariantConfig;
    const roleConfig = typography.roles[textRole] as ResolvedRoleConfig;

    const resolvedColor = !color
      ? colors.text
      : color in colors
        ? colors[color as ThemeColorKey]
        : color in semanticColors
          ? semanticColors[color as SemanticColorKey]
          : color;

    const resolvedWeight = weight ?? roleConfig.weight ?? config.defaultWeight;
    const resolvedFamilyRole = familyRole ?? roleConfig.familyRole ?? config.defaultFamilyRole;
    const resolvedFontFamily = roleConfig.fontFamily
      ? roleConfig.fontFamily
      : getFontFamilyForRole(resolvedFamilyRole, resolvedWeight);
    const resolvedLetterSpacing = roleConfig.letterSpacing ?? config.letterSpacing;
    const resolvedFontVariant = typography.numeric[numeric]
      ? [...typography.numeric[numeric]]
      : undefined;

    return (
      <Text
        ref={ref}
        style={[
          {
            fontFamily: resolvedFontFamily,
            fontSize: config.fontSize,
            lineHeight: config.lineHeight,
            letterSpacing: resolvedLetterSpacing,
            color: resolvedColor,
            textAlign: align,
            fontVariant: resolvedFontVariant as FontVariant[] | undefined,
            textTransform: roleConfig.textTransform ?? config.textTransform,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  },
);

// ---------------------------------------------------------------------------
// Animated version — for Reanimated entering/exiting/layout animations
// ---------------------------------------------------------------------------

export const AnimatedTypography =
  Animated.createAnimatedComponent(Typography);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type { TypographyVariant, TypographyProps, TypographyWeight };
