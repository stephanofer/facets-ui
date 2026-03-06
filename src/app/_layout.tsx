import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "expo-router";
import { Stack } from "expo-router/stack";
import { ShareIntentProvider } from "expo-share-intent";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { colors } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth-store";
import { useOnboardingStore } from "@/stores/onboarding-store";

// Keep the native splash screen visible until we know the auth state.
// This MUST be called at module level (top of file), before any component renders.
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isDark, colors: themeColors } = useAppTheme();
  const hasCompletedOnboarding = useOnboardingStore(
    (s) => s.hasCompletedOnboarding,
  );
  const authStatus = useAuthStore((s) => s.status);
  const initialize = useAuthStore((s) => s.initialize);

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Navigate based on combined onboarding + auth state,
  // then hide the splash screen once we know where to go.
  useEffect(() => {
    // Don't navigate until auth is resolved
    if (authStatus === "loading") return;

    if (!hasCompletedOnboarding) {
      router.replace("/onboarding" as never);
    } else if (authStatus === "unauthenticated") {
      router.replace("/(auth)/welcome" as never);
    } else if (authStatus === "authenticated") {
      router.replace("/(tabs)/(home)" as never);
    }

    // Auth state is resolved and navigation has been triggered.
    // Hide the splash screen so the correct route is revealed.
    SplashScreen.hideAsync();
  }, [hasCompletedOnboarding, authStatus]);

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

  // Return nothing while loading — the native splash screen stays visible
  // covering this completely. No ActivityIndicator needed.
  if (authStatus === "loading") {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          animation: "fade",
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
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
    <ShareIntentProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <RootNavigator />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ShareIntentProvider>
  );
}
