import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { useAppTheme } from "@/hooks/use-app-theme";
import { fonts, radius, spacing } from "@/constants/theme";

const OTP_LENGTH = 6;

interface OtpInputProps {
  onComplete: (code: string) => void;
  error?: string;
  disabled?: boolean;
}

export function OtpInput({ onComplete, error, disabled }: OtpInputProps) {
  const { colors, isDark } = useAppTheme();
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);
  const shakeX = useSharedValue(0);

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  // Shake on error
  useEffect(() => {
    if (error) {
      if (process.env.EXPO_OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
      setCode("");
    }
  }, [error, shakeX]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleChange = useCallback(
    (text: string) => {
      // Only allow digits
      const cleaned = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
      setCode(cleaned);

      if (cleaned.length === OTP_LENGTH) {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        onComplete(cleaned);
      }
    },
    [onComplete],
  );

  const handlePress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={{ gap: spacing.md }}>
      {/* Hidden input */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        editable={!disabled}
        style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
      />

      {/* Visual boxes */}
      <Pressable onPress={handlePress}>
        <Animated.View
          style={[
            {
              flexDirection: "row",
              justifyContent: "center",
              gap: spacing.sm,
            },
            shakeStyle,
          ]}
        >
          {Array.from({ length: OTP_LENGTH }).map((_, index) => {
            const isFilled = index < code.length;
            const isCurrent = index === code.length;
            const digit = code[index] ?? "";

            return (
              <View
                key={index}
                style={{
                  width: 48,
                  height: 56,
                  borderRadius: radius.md,
                  borderCurve: "continuous",
                  borderWidth: isCurrent ? 2 : 1.5,
                  borderColor: error
                    ? "#EF4444"
                    : isCurrent
                      ? colors.primary
                      : isFilled
                        ? isDark
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(0, 0, 0, 0.15)"
                        : isDark
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.08)",
                  backgroundColor: isFilled
                    ? isDark
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(0, 0, 0, 0.02)"
                    : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: fonts.sizes["2xl"],
                    fontWeight: fonts.weights.bold,
                    color: colors.text,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {digit}
                </Text>
              </View>
            );
          })}
        </Animated.View>
      </Pressable>

      {error && (
        <Text
          style={{
            fontSize: fonts.sizes.sm,
            color: "#EF4444",
            fontWeight: fonts.weights.medium,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
