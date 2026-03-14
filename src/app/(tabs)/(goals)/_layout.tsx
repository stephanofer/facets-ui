import { Stack } from "expo-router/stack";

export default function GoalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
