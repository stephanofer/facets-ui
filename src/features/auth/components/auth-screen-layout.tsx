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
import type { ViewStyle } from "react-native";

export interface RegisterProgressConfig {
  currentStep: 1 | 2 | 3;
  totalSteps: 3;
  label?: string;
}

type AuthHeaderVariant = "landing" | "standard";

interface AuthScreenLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  headerVariant?: AuthHeaderVariant;
  logoPlaceholderText?: string;
  registerProgress?: RegisterProgressConfig;
  backHref?: string;
  contentContainerStyle?: ViewStyle;
}

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  footer,
  headerVariant = "standard",
  logoPlaceholderText = "FACETS",
  registerProgress,
  backHref,
  contentContainerStyle,
}: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const showBackButton = headerVariant === "standard";

  const handleBack = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (backHref) {
      router.replace(backHref as never);
    }
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
          <Animated.View entering={FadeIn.duration(250)} style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                paddingTop: insets.top + spacing.md,
                paddingHorizontal: spacing.xl,
              }}
            >
              <View
                style={{
                  minHeight: 40,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  {showBackButton ? (
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
                      <Icon name="CaretLeft" size={20} color={colors.text} />
                    </Pressable>
                  ) : (
                    <View style={{ width: 40, height: 40 }} />
                  )}
                </View>

                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Typography
                    variant="label"
                    color="primary"
                    weight="bold"
                    style={{ letterSpacing: 1.8 }}
                  >
                    {logoPlaceholderText}
                  </Typography>
                </View>

                <View style={{ width: 40, height: 40 }} />
              </View>

              {registerProgress ? (
                <View style={{ paddingTop: spacing.lg, paddingBottom: spacing.md }}>
                  <AuthRegisterProgress config={registerProgress} />
                </View>
              ) : null}

              {title || subtitle ? (
                <View
                  style={{
                    gap: spacing.xs,
                    paddingTop: headerVariant === "landing" ? spacing.lg : spacing.md,
                    paddingBottom: spacing.xl,
                  }}
                >
                  {title ? (
                    <Typography variant="h2" color="text" style={{ letterSpacing: -0.3 }}>
                      {title}
                    </Typography>
                  ) : null}
                  {subtitle ? (
                    <Typography variant="caption" color="textMuted" style={{ lineHeight: 20 }}>
                      {subtitle}
                    </Typography>
                  ) : null}
                </View>
              ) : null}

              <View style={[{ gap: spacing.lg }, contentContainerStyle]}>{children}</View>
            </View>

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

interface AuthRegisterProgressProps {
  config: RegisterProgressConfig;
}

function AuthRegisterProgress({ config }: AuthRegisterProgressProps) {
  const { colors } = useAppTheme();

  return (
    <View style={{ gap: spacing.sm }}>
      <Typography variant="small" color="textMuted" weight="medium">
        {config.label ?? `Paso ${config.currentStep} de ${config.totalSteps}`}
      </Typography>

      <View style={{ flexDirection: "row", gap: spacing.xs }}>
        {Array.from({ length: config.totalSteps }).map((_, index) => {
          const isCompleted = index < config.currentStep;

          return (
            <View
              key={`register-progress-${index}`}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 999,
                backgroundColor: isCompleted
                  ? colors.primary
                  : colors.border,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
