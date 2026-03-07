import { ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/hooks/use-app-theme";
import { fonts, spacing } from "@/constants/theme";

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: spacing.xl,
        paddingTop:
          process.env.EXPO_OS === "android" ? insets.top + spacing.xl : spacing.xl,
        paddingBottom: insets.bottom + spacing.xl,
      }}
    >
      <Text
        style={{
          color: colors.textMuted,
          fontSize: fonts.sizes.md,
          textAlign: "center",
        }}
      >
        Settings will appear here
      </Text>
    </ScrollView>
  );
}
