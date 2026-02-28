import { useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "expo-router";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { colors } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { queryClient } from "@/lib/query-client";
import { useOnboardingStore } from "@/stores/onboarding-store";

function RootNavigator() {
  const { isDark } = useAppTheme();
  const hasCompletedOnboarding = useOnboardingStore(
    (s) => s.hasCompletedOnboarding,
  );

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      router.replace("/onboarding" as never);
    } else {
      // TODO: Check auth state — for now, go to auth welcome
      router.replace("/(auth)/welcome" as never);
    }
  }, [hasCompletedOnboarding]);

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
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            animation: "fade",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
