import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import { useAppTheme } from "@/hooks/use-app-theme";
import { fonts, spacing } from "@/constants/theme";

import type { ReactNode } from "react";

interface AuthScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  showBackButton?: boolean;
}

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  footer,
  showBackButton = true,
}: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const handleBack = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <KeyboardAvoidingView
          behavior={process.env.EXPO_OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              paddingTop: insets.top + spacing.md,
              paddingHorizontal: spacing.xl,
            }}
          >
            {/* Back button */}
            {showBackButton && (
              <Pressable
                onPress={handleBack}
                hitSlop={12}
                style={({ pressed }) => ({
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  marginLeft: -spacing.sm,
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Image
                  source={`sf:chevron.left`}
                  style={{ width: 20, height: 20 }}
                  tintColor={colors.text}
                />
              </Pressable>
            )}

            {/* Title + Subtitle */}
            <Animated.View
              entering={FadeInDown.duration(250).delay(50)}
              style={{
                gap: spacing.xs,
                paddingTop: spacing.md,
                paddingBottom: spacing.xl,
              }}
            >
              <Text
                style={{
                  fontSize: fonts.sizes["2xl"],
                  fontWeight: fonts.weights.bold,
                  color: colors.text,
                  letterSpacing: -0.3,
                }}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  style={{
                    fontSize: fonts.sizes.sm,
                    fontWeight: fonts.weights.regular,
                    color: colors.textMuted,
                    lineHeight: 20,
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </Animated.View>

            {/* Form content */}
            <Animated.View
              entering={FadeInDown.duration(250).delay(100)}
              style={{ gap: spacing.lg }}
            >
              {children}
            </Animated.View>
          </View>

          {/* Footer (button) — sits at bottom but above keyboard */}
          <Animated.View
            entering={FadeInDown.duration(250).delay(150)}
            style={{
              paddingHorizontal: spacing.xl,
              paddingBottom: insets.bottom + spacing.lg,
              paddingTop: spacing.lg,
            }}
          >
            {footer}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
