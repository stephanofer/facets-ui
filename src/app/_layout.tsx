import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { ShareIntentProvider } from "expo-share-intent";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/theme";
import { useAuthBootstrap } from "@/features/auth/hooks/use-auth-bootstrap";
import { useAppTheme } from "@/hooks/use-app-theme";
import { queryClient } from "@/lib/query-client";
import { AppToaster } from "@/lib/toast";
import { useAuthStore } from "@/stores/auth-store";

// Keep the native splash screen visible until we know the auth state.
// This MUST be called at module level (top of file), before any component renders.
SplashScreen.preventAutoHideAsync();

function UnsafeAreaDebugOverlay() {
  const insets = useSafeAreaInsets();

  return (
    <>
      {insets.top > 0 ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: insets.top,
            backgroundColor: "#FF00A8",
            zIndex: 999,
          }}
        />
      ) : null}

      {insets.bottom > 0 ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: insets.bottom,
            backgroundColor: "#00D1FF",
            zIndex: 999,
          }}
        />
      ) : null}
    </>
  );
}

function RootNavigator() {
  const { isDark } = useAppTheme();
  const bootstrapStatus = useAuthStore((s) => s.bootstrapStatus);

  useAuthBootstrap();

  useEffect(() => {
    if (bootstrapStatus === "bootstrapping") {
      return;
    }

    SplashScreen.hideAsync();
  }, [bootstrapStatus]);

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

  if (bootstrapStatus === "bootstrapping") {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <View style={{ flex: 1 }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerBackButtonDisplayMode: "minimal",
            animation: Platform.select({
              ios: "default",
              android: "fade",
              default: "default",
            }),
          }}
        >
          <Stack.Protected
            guard={
              bootstrapStatus === "authenticated" ||
              bootstrapStatus === "recovery-required"
            }
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="profile-avatar-sheet"
              options={{
                presentation: "formSheet",
                headerShown: false,
                contentStyle: { backgroundColor: "transparent" },
                sheetGrabberVisible: true,
                sheetAllowedDetents: [0.38],
                sheetLargestUndimmedDetentIndex: 0,
              }}
            />
          </Stack.Protected>
          <Stack.Protected guard={bootstrapStatus === "unauthenticated"}>
            <Stack.Screen
              name="(auth)"
              options={{
                headerShown: false,
              }}
            />
          </Stack.Protected>
          <Stack.Screen name="+not-found" />
        </Stack>

        <UnsafeAreaDebugOverlay />
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ShareIntentProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <>
            <RootNavigator />
            <AppToaster />
          </>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ShareIntentProvider>
  );
}
