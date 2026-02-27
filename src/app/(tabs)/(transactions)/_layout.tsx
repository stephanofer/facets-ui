import { Stack } from "expo-router/stack";

export default function TransactionsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Transactions" }} />
    </Stack>
  );
}
