import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

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
          behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {/* Single FadeIn (opacity only) for the whole screen — no transform animations
              inside KAV, because FadeInDown/SlideIn transforms conflict with KAV repositioning
              and cause the footer to "stick" after keyboard dismiss. */}
          <Animated.View entering={FadeIn.duration(250)} style={{ flex: 1 }}>
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
                  <Icon
                    name="CaretLeft"
                    size={20}
                    color={colors.text}
                  />
                </Pressable>
              )}

              {/* Title + Subtitle */}
              <View
                style={{
                  gap: spacing.xs,
                  paddingTop: spacing.md,
                  paddingBottom: spacing.xl,
                }}
              >
                <Typography variant="h2" color="text" style={{ letterSpacing: -0.3 }}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="caption" color="textMuted" style={{ lineHeight: 20 }}>
                    {subtitle}
                  </Typography>
                )}
              </View>

              {/* Form content */}
              <View style={{ gap: spacing.lg }}>
                {children}
              </View>
            </View>

            {/* Footer (button) — sits at bottom but above keyboard */}
            <View
              style={{
                paddingHorizontal: spacing.xl,
                paddingBottom: insets.bottom + spacing.lg,
                paddingTop: spacing.lg,
              }}
            >
              {footer}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
