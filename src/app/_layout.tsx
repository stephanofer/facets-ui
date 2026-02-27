import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { queryClient } from "@/lib/query-client";

function RootNavigator() {
  const { isDark, colors: themeColors } = useAppTheme();

  const navigationTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.dark.primary,
          background: colors.dark.background,
          card: colors.dark.card,
          text: colors.dark.text,
          border: colors.dark.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.light.primary,
          background: colors.light.background,
          card: colors.light.card,
          text: colors.light.text,
          border: colors.light.border,
        },
      };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
}
