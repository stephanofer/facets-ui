import { Link } from "expo-router";
import { Stack } from "expo-router/stack";
import { View } from "react-native";

import { Typography } from "@/components/ui/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { spacing } from "@/constants/theme";

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
        <Typography variant="h2" color="text">
          Page not found
        </Typography>
        <Link href="/" asChild>
          <Typography variant="bodyMedium" color="primary">
            Go to home
          </Typography>
        </Link>
      </View>
    </>
  );
}
