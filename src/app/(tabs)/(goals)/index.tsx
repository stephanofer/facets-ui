import { ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fonts, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

export default function GoalsScreen() {
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
        Goals will appear here
      </Text>
    </ScrollView>
  );
}
