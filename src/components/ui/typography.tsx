import { forwardRef } from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";

import { fontFamily, semanticColors } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

import type { TextProps } from "react-native";
import type { ThemeColorKey, SemanticColorKey } from "@/constants/theme";

// ---------------------------------------------------------------------------
// Variant Configuration
// ---------------------------------------------------------------------------
// Each variant defines a complete text style: font family, size, line height,
// and letter spacing. Variants are the PRIMARY way to style text.
// ---------------------------------------------------------------------------

const variantConfig = {
  h1: { fontFamily: fontFamily.bold, fontSize: 30, lineHeight: 38, letterSpacing: -0.3 },
  h2: { fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 32, letterSpacing: -0.2 },
  h3: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 28, letterSpacing: -0.1 },
  subtitle: { fontFamily: fontFamily.medium, fontSize: 18, lineHeight: 26, letterSpacing: 0 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  label: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  caption: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  small: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16, letterSpacing: 0.2 },
} as const;

type TypographyVariant = keyof typeof variantConfig;
type FontWeight = keyof typeof fontFamily;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TypographyProps extends TextProps {
  /** Predefined text style — pick the right one for the context */
  variant?: TypographyVariant;
  /** Override the variant's default font weight */
  weight?: FontWeight;
  /** Theme color key, semantic color key, or raw color string */
  color?: ThemeColorKey | SemanticColorKey | (string & {});
  /** Text alignment shorthand */
  align?: "left" | "center" | "right";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Typography = forwardRef<Text, TypographyProps>(
  function Typography(
    { variant = "body", weight, color, align, style, children, ...props },
    ref,
  ) {
    const { colors } = useAppTheme();

    const config = variantConfig[variant];

    // Resolve color: theme key → semantic key → raw passthrough
    const resolvedColor = !color
      ? colors.text
      : color in colors
        ? colors[color as ThemeColorKey]
        : color in semanticColors
          ? semanticColors[color as SemanticColorKey]
          : color;

    // Weight override replaces the variant's default font family
    const resolvedFontFamily = weight
      ? fontFamily[weight]
      : config.fontFamily;

    return (
      <Text
        ref={ref}
        style={[
          {
            fontFamily: resolvedFontFamily,
            fontSize: config.fontSize,
            lineHeight: config.lineHeight,
            letterSpacing: config.letterSpacing,
            color: resolvedColor,
            textAlign: align,
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

export type { TypographyVariant, TypographyProps, FontWeight };
