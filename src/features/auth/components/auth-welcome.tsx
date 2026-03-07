import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Linking, Pressable, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/typography";
import { radius, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

// TODO: Replace with real URLs before production launch
const PRIVACY_POLICY_URL = "https://example.com/privacy-policy";
const TERMS_OF_SERVICE_URL = "https://example.com/terms-of-service";

interface AuthWelcomeProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function AuthWelcome({ onCreateAccount, onLogin }: AuthWelcomeProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  const handleCreateAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCreateAccount();
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLogin();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top section — branding + hero image */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: insets.top + spacing.xl,
          paddingHorizontal: spacing.xl,
          gap: spacing.xl,
        }}
      >
        {/* Logo / Brand */}
        <Animated.View
          entering={FadeIn.duration(300)}
          style={{ alignItems: "center", gap: spacing.sm }}
        >
          <Typography
            variant="h1"
            color="primary"
            style={{ fontSize: 36, lineHeight: 42, fontStyle: "italic", letterSpacing: 2 }}
          >
            FACETS
          </Typography>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(80)}
          style={{ alignItems: "center", gap: spacing.xs }}
        >
          <Typography
            variant="h2"
            color="text"
            weight="medium"
            align="center"
            style={{ letterSpacing: -0.3 }}
          >
            Mirá tu plata,
          </Typography>
          <Typography
            variant="h2"
            color="primary"
            weight="medium"
            align="center"
            style={{ letterSpacing: -0.3 }}
          >
            de otra manera
          </Typography>
        </Animated.View>

        {/* Hero image */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(160)}
          style={{
            width: 260,
            height: 260,
            borderRadius: radius.xl,
            borderCurve: "continuous",
            overflow: "hidden",
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.03)",
          }}
        >
          <Image
            source="https://illustrations.popsy.co/violet/rich-man.svg"
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
            transition={200}
          />
        </Animated.View>
      </View>

      {/* Bottom section — CTAs */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(250)}
        style={{
          paddingHorizontal: spacing.xl,
          paddingBottom: insets.bottom + spacing.xl,
          gap: spacing.md,
        }}
      >
        {/* Primary — Create Account */}
        <Pressable
          onPress={handleCreateAccount}
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? colors.primary + "DD"
              : colors.primary,
            height: 56,
            borderRadius: radius.lg,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Typography
            variant="subtitle"
            color="#FFFFFF"
            weight="bold"
            style={{ letterSpacing: 0.2 }}
          >
            Crear cuenta
          </Typography>
        </Pressable>

        {/* Secondary — Login */}
        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.06)"
              : "transparent",
            height: 56,
            borderRadius: radius.lg,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1.5,
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(0, 0, 0, 0.1)",
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Typography
            variant="subtitle"
            color="text"
            weight="bold"
            style={{ letterSpacing: 0.2 }}
          >
            Ya tengo cuenta
          </Typography>
        </Pressable>

        {/* Legal links */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: spacing.xl,
            paddingTop: spacing.sm,
          }}
        >
          <Pressable hitSlop={8} onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
            <Typography variant="small" color="textMuted">
              Política de Privacidad
            </Typography>
          </Pressable>
          <Pressable hitSlop={8} onPress={() => Linking.openURL(TERMS_OF_SERVICE_URL)}>
            <Typography variant="small" color="textMuted">
              Términos de Servicio
            </Typography>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
