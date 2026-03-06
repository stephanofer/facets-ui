import { Stack } from "expo-router/stack";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="share-intent-debug"
        options={{ title: "Shared Content" }}
      />
    </Stack>
  );
}
