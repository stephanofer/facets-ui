import { useColorScheme } from "react-native";

import { colors, semanticColors } from "@/constants/theme";
import { useUIStore } from "@/stores/ui-store";

import type { ThemeColors, SemanticColors } from "@/constants/theme";

interface AppTheme {
  scheme: "light" | "dark";
  isDark: boolean;
  colors: ThemeColors;
  semantic: SemanticColors;
}

export function useAppTheme(): AppTheme {
  const systemScheme = useColorScheme();
  const preference = useUIStore((s) => s.colorSchemePreference);

  const resolvedScheme: "light" | "dark" =
    preference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  return {
    scheme: resolvedScheme,
    isDark: resolvedScheme === "dark",
    colors: colors[resolvedScheme],
    semantic: semanticColors,
  };
}
