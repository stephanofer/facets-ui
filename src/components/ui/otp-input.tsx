import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { AnimatedTypography, Typography } from "@/components/ui/typography";
import { radius, spacing, typography } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

const OTP_LENGTH = 6;

interface OtpInputProps {
  onComplete: (code: string) => void;
  error?: string;
  disabled?: boolean;
}

export function OtpInput({ onComplete, error, disabled }: OtpInputProps) {
  const { colors, isDark } = useAppTheme();
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const shakeX = useSharedValue(0);
  const cursorOpacity = useSharedValue(1);
  const prevErrorRef = useRef(error);

  // Auto-focus on mount — use InteractionManager for reliability on Android
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Blinking cursor animation
  useEffect(() => {
    if (isFocused && code.length < OTP_LENGTH && !disabled) {
      cursorOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 200 }),
          withTiming(0, { duration: 300 }),
        ),
        -1,
        false,
      );
    } else {
      cursorOpacity.value = 0;
    }
  }, [isFocused, code.length, disabled, cursorOpacity]);

  // Shake + clear on error, then re-focus
  useEffect(() => {
    if (error && error !== prevErrorRef.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
      setCode("");

      // Re-focus after error so user can immediately type again
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    prevErrorRef.current = error;
  }, [error, shakeX]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  const handleChange = useCallback(
    (text: string) => {
      if (disabled) return;

      // Only allow digits
      const cleaned = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
      setCode(cleaned);

      // Haptic feedback per digit
      if (cleaned.length > code.length) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (cleaned.length === OTP_LENGTH) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // Dismiss keyboard and submit
        inputRef.current?.blur();
        onComplete(cleaned);
      }
    },
    [onComplete, disabled, code.length],
  );

  const handlePress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  return (
    <View style={{ gap: spacing.md }}>
      {/* Hidden input — positioned off-screen for better Android compatibility */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        editable={!disabled}
        caretHidden
        style={{
          position: "absolute",
          opacity: 0,
          height: 1,
          width: 1,
          ...typography.native.controlText,
          // Position off-screen to avoid visual artifacts on Android
          left: -1000,
        }}
      />

      {/* Visual boxes */}
      <Pressable onPress={handlePress} accessible accessibilityRole="none">
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
            const isCurrent = index === code.length && isFocused && !disabled;
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
                    : isCurrent
                      ? isDark
                        ? "rgba(255, 255, 255, 0.02)"
                        : "rgba(0, 0, 0, 0.01)"
                      : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isFilled ? (
                  <AnimatedTypography
                    size={24}
                    lineHeight={32}
                    weight="semibold"
                    numeric="tabular"
                    entering={FadeIn.duration(100)}
                    style={{
                      color: colors.text,
                    }}
                  >
                    {digit}
                  </AnimatedTypography>
                ) : isCurrent ? (
                  <Animated.View
                    style={[
                      {
                        width: 2,
                        height: 24,
                        backgroundColor: colors.primary,
                        borderRadius: 1,
                      },
                      cursorStyle,
                    ]}
                  />
                ) : null}
              </View>
            );
          })}
        </Animated.View>
      </Pressable>

      {/* Loading state */}
      {disabled && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(100)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.sm,
          }}
        >
          <ActivityIndicator size="small" color={colors.primary} />
          <Typography size={14} lineHeight={20} weight="medium" color="textMuted">
            Verificando...
          </Typography>
        </Animated.View>
      )}

      {/* Error message */}
      {error && !disabled && (
          <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)}>
            <Typography
              size={14}
              lineHeight={20}
              weight="medium"
              color="#EF4444"
              selectable
              align="center"
          >
            {error}
          </Typography>
        </Animated.View>
      )}

      {/* Tap to focus hint — only when not focused and no code entered */}
      {!isFocused && code.length === 0 && !disabled && !error && (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(100)}>
          <Typography
            size={12}
            lineHeight={16}
            weight="medium"
            color="textMuted"
            align="center"
          >
            Tocá para ingresar el código
          </Typography>
        </Animated.View>
      )}
    </View>
  );
}
