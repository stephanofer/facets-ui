import { Link } from "expo-router";
import { Stack } from "expo-router/stack";
import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import { spacing, fonts } from "@/constants/theme";

export default function NotFoundScreen() {
  const { colors } = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          gap: spacing.lg,
          padding: spacing.xl,
        }}
      >
        <Text
          style={{
            fontSize: fonts.sizes["2xl"],
            fontWeight: fonts.weights.bold,
            color: colors.text,
          }}
        >
          Page not found
        </Text>
        <Link href="/" style={{ color: colors.primary }}>
          <Text
            style={{
              fontSize: fonts.sizes.md,
              color: colors.primary,
              fontWeight: fonts.weights.medium,
            }}
          >
            Go to home
          </Text>
        </Link>
      </View>
    </>
  );
}
