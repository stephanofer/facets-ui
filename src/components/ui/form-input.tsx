import { forwardRef, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Icon } from "@/components/ui/icon";
import { fonts, radius, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

import type { TextInputProps } from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(
  function FormInput({ label, error, secureTextEntry, style, ...props }, ref) {
    const { colors, isDark } = useAppTheme();
    const internalRef = useRef<TextInput>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Use forwarded ref if provided, otherwise use internal ref
    const inputRef = (ref as React.RefObject<TextInput>) ?? internalRef;

    const hasError = !!error;
    const isPassword = secureTextEntry !== undefined;
    const borderColor = hasError
      ? "#EF4444"
      : isDark
        ? "rgba(255, 255, 255, 0.12)"
        : "rgba(0, 0, 0, 0.12)";

    const handleContainerPress = () => {
      inputRef.current?.focus();
    };

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    return (
      <View style={{ gap: spacing.xs }}>
        <Pressable
          onPress={handleContainerPress}
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
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
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
              ref={inputRef}
              placeholderTextColor={colors.textMuted}
              secureTextEntry={isPassword ? !isPasswordVisible : undefined}
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

          {isPassword && (
            <Pressable
              onPress={togglePasswordVisibility}
              hitSlop={12}
              style={{
                marginLeft: spacing.sm,
                padding: spacing.xs,
              }}
            >
              <Icon
                name={isPasswordVisible ? "EyeSlash" : "Eye"}
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </Pressable>

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
