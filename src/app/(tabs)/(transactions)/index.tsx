import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/typography";
import { spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

export default function TransactionsScreen() {
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
      <Typography variant="body" color="textMuted" align="center">
        Transactions will appear here
      </Typography>
    </ScrollView>
  );
}
