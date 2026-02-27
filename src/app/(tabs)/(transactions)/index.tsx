import { ScrollView, Text } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";
import { fonts, spacing } from "@/constants/theme";

export default function TransactionsScreen() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.xl }}
    >
      <Text
        style={{
          color: colors.textMuted,
          fontSize: fonts.sizes.md,
          textAlign: "center",
        }}
      >
        Transactions will appear here
      </Text>
    </ScrollView>
  );
}
