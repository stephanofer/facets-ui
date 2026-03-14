import { forwardRef } from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";

import {
  resolveTypographyFontFamily,
  semanticColors,
  typography,
} from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

import type { FontVariant, TextProps } from "react-native";
import type {
  SemanticColorKey,
  ThemeColorKey,
  TypographyFamily,
  TypographyNumeric,
  TypographyWeight,
} from "@/constants/theme";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TypographyProps extends TextProps {
  family?: TypographyFamily;
  size?: number;
  lineHeight?: number;
  letterSpacing?: number;
  weight?: TypographyWeight;
  color?: ThemeColorKey | SemanticColorKey | (string & {});
  align?: "left" | "center" | "right";
  numeric?: TypographyNumeric;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Typography = forwardRef<Text, TypographyProps>(
  function Typography(
    {
      family,
      size,
      lineHeight,
      letterSpacing,
      weight,
      color,
      align,
      numeric = "default",
      style,
      children,
      ...props
    },
    ref,
  ) {
    const { colors } = useAppTheme();

    const resolvedColor = !color
      ? colors.text
      : color in colors
        ? colors[color as ThemeColorKey]
        : color in semanticColors
          ? semanticColors[color as SemanticColorKey]
          : color;

    const resolvedWeight = weight ?? "regular";
    const resolvedFamily = family ?? "product";
    const resolvedFontFamily = resolveTypographyFontFamily(
      resolvedFamily,
      resolvedWeight,
    );
    const resolvedFontSize = size ?? 16;
    const resolvedLineHeight = lineHeight ?? Math.round(resolvedFontSize * 1.4);
    const resolvedLetterSpacing = letterSpacing ?? 0;
    const resolvedFontVariant = typography.numeric[numeric]
      ? [...typography.numeric[numeric]]
      : undefined;

    return (
      <Text
        ref={ref}
        style={[
          {
            fontFamily: resolvedFontFamily,
            fontSize: resolvedFontSize,
            lineHeight: resolvedLineHeight,
            letterSpacing: resolvedLetterSpacing,
            color: resolvedColor,
            textAlign: align,
            fontVariant: resolvedFontVariant as FontVariant[] | undefined,
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

export type { TypographyProps, TypographyWeight };
