import { forwardRef } from "react";
import { Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useAppTheme } from "@/hooks/use-app-theme";
import { fonts, radius, spacing } from "@/constants/theme";

import type { TextInputProps } from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  function FormInput({ label, error, style, ...props }, ref) {
    const { colors, isDark } = useAppTheme();

    const hasError = !!error;
    const borderColor = hasError
      ? "#EF4444"
      : isDark
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.12)";

    return (
      <View style={{ gap: spacing.xs }}>
        <View
          style={{
            borderWidth: 1.5,
            borderColor,
            borderRadius: radius.md,
            borderCurve: "continuous",
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.02)",
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: fonts.sizes.xs,
              fontWeight: fonts.weights.medium,
              color: hasError ? "#EF4444" : colors.textMuted,
              marginBottom: 2,
            }}
          >
            {label}
          </Text>
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textMuted}
            style={[
              {
                fontSize: fonts.sizes.md,
                fontWeight: fonts.weights.medium,
                color: colors.text,
                padding: 0,
                height: 24,
              },
              style,
            ]}
            {...props}
          />
        </View>

        {hasError && (
          <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)}>
            <Text
              style={{
                fontSize: fonts.sizes.xs,
                color: "#EF4444",
                fontWeight: fonts.weights.medium,
                paddingLeft: spacing.xs,
              }}
            >
              {error}
            </Text>
          </Animated.View>
        )}
      </View>
    );
  },
);
