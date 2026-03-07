import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";

import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

interface AdaptiveGlassViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  interactive?: boolean;
  tintColor?: string;
}

export function AdaptiveGlassView({
  children,
  style,
  interactive = false,
  tintColor,
}: AdaptiveGlassViewProps) {
  const { colors, isDark } = useAppTheme();

  if (
    process.env.EXPO_OS === "ios" &&
    isGlassEffectAPIAvailable() &&
    isLiquidGlassAvailable()
  ) {
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive={interactive}
        tintColor={tintColor}
        style={style}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: isDark
            ? "rgba(21, 28, 44, 0.72)"
            : "rgba(255, 255, 255, 0.82)",
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
