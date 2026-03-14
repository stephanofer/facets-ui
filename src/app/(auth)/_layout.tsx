import { Stack } from "expo-router/stack";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="register-name" />
      <Stack.Screen name="register-email" />
      <Stack.Screen name="register-password" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
