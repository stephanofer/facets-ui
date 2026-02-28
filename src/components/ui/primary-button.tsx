import { ActivityIndicator, Pressable, Text } from "react-native";
import * as Haptics from "expo-haptics";

import { useAppTheme } from "@/hooks/use-app-theme";
import { fonts, radius } from "@/constants/theme";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: PrimaryButtonProps) {
  const { colors, isDark } = useAppTheme();

  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (isDisabled) return;
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => ({
        backgroundColor: isPrimary
          ? isDisabled
            ? colors.primary + "66"
            : pressed
              ? colors.primary + "DD"
              : colors.primary
          : pressed
            ? isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)"
            : "transparent",
        height: 52,
        borderRadius: radius.lg,
        borderCurve: "continuous",
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: pressed && !isDisabled ? 0.97 : 1 }],
        ...(isPrimary
          ? {}
          : {
              borderWidth: 1.5,
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.1)",
            }),
      })}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? "#FFFFFF" : colors.text}
          size="small"
        />
      ) : (
        <Text
          style={{
            color: isPrimary ? "#FFFFFF" : colors.text,
            fontSize: fonts.sizes.md,
            fontWeight: fonts.weights.semibold,
            letterSpacing: 0.2,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
