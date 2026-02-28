import { Pressable, ScrollView, Text } from "react-native";
import { router } from "expo-router";

import { useAppTheme } from "@/hooks/use-app-theme";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { fonts, radius, spacing } from "@/constants/theme";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const resetOnboarding = useOnboardingStore((s) => s.resetOnboarding);

  const handleResetOnboarding = () => {
    resetOnboarding();
    router.replace("/onboarding" as never);
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.xl,
        gap: spacing.lg,
      }}
    >
      <Text style={{ color: colors.text, fontSize: fonts.sizes.lg }}>Home</Text>

      <Pressable
        onPress={handleResetOnboarding}
        style={({ pressed }) => ({
          backgroundColor: pressed ? colors.primary + "CC" : colors.primary,
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          borderRadius: radius.md,
          borderCurve: "continuous",
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: fonts.sizes.md,
            fontWeight: fonts.weights.semibold,
          }}
        >
          Reiniciar Onboarding
        </Text>
      </Pressable>
    </ScrollView>
  );
}
