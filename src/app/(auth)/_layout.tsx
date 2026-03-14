import { Stack } from "expo-router/stack";
import { Platform } from "react-native";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.select({
          ios: "default",
          android: "fade",
          default: "default",
        }),
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="register-name" />
      <Stack.Screen name="register-email" />
      <Stack.Screen name="register-password" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
