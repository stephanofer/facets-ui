import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { OtpInput } from "@/components/ui/otp-input";
import { Typography } from "@/components/ui/typography";
import { spacing } from "@/constants/theme";
import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import { useResendVerification } from "@/features/auth/hooks/use-resend-verification";
import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ApiError } from "@/lib/api-client";

const RESEND_COOLDOWN_SECONDS = 60;
const VERIFY_RETRY_COOLDOWN_SECONDS = 30;

function getCooldownFromMessage(message?: string, fallback = VERIFY_RETRY_COOLDOWN_SECONDS) {
  if (!message) {
    return fallback;
  }

  const secondsMatch = message.match(/(\d+)\s*s/i);

  if (secondsMatch) {
    return Number(secondsMatch[1]);
  }

  const digitsMatch = message.match(/(\d+)/);

  if (digitsMatch) {
    return Number(digitsMatch[1]);
  }

  return fallback;
}

export default function VerifyEmailScreen() {
  const { email, source } = useLocalSearchParams<{
    email: string;
    source: "register" | "login";
  }>();
  const { colors } = useAppTheme();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const backHref = source === "register" ? "/(auth)/register-password" : "/(auth)/login";

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Clear resend success message after a few seconds
  useEffect(() => {
    if (!resendSuccess) return;
    const timer = setTimeout(() => setResendSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [resendSuccess]);

  const handleComplete = useCallback(
    (code: string) => {
      if (!email || cooldown > 0 || verifyEmail.isPending) return;
      setOtpError("");

      verifyEmail.mutate(
        { email, code },
        {
          onError: (error) => {
            if (error instanceof ApiError) {
              switch (error.code) {
                case "INVALID_OTP":
                  setOtpError(error.message || "Código incorrecto");
                  break;
                case "OTP_EXPIRED":
                  setOtpError("El código expiró. Pedí uno nuevo.");
                  break;
                case "OTP_MAX_ATTEMPTS":
                  setOtpError("Demasiados intentos. Pedí un nuevo código.");
                  setCooldown(VERIFY_RETRY_COOLDOWN_SECONDS);
                  break;
                case "OTP_COOLDOWN":
                case "OTP_RATE_LIMITED": {
                  const nextCooldown = getCooldownFromMessage(error.message);
                  setCooldown(nextCooldown);
                  setOtpError(
                    error.code === "OTP_RATE_LIMITED"
                      ? `Esperá ${nextCooldown}s antes de volver a intentar o reenviar.`
                      : error.message || `Esperá ${nextCooldown}s antes de volver a intentar.`,
                  );
                  break;
                }
                case "EMAIL_ALREADY_VERIFIED":
                  // Already verified — the session was set, will redirect
                  break;
                default:
                  setOtpError(error.message || "Algo salió mal");
              }
            } else {
              setOtpError("Error de conexión. Intentá de nuevo.");
            }
          },
          // onSuccess: auth store is updated by the hook → root layout redirects
        },
      );
    },
    [cooldown, email, verifyEmail],
  );

  const handleResend = () => {
    if (cooldown > 0 || !email || resendVerification.isPending) return;
    setOtpError("");

    resendVerification.mutate(email, {
      onSuccess: () => {
        setCooldown(RESEND_COOLDOWN_SECONDS);
        setResendSuccess(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.code === "OTP_COOLDOWN") {
            const nextCooldown = getCooldownFromMessage(
              error.message,
              VERIFY_RETRY_COOLDOWN_SECONDS,
            );
            setCooldown(nextCooldown);
            setOtpError(`Esperá ${nextCooldown}s antes de volver a intentar o reenviar.`);
          } else if (error.code === "OTP_RATE_LIMITED") {
            const nextCooldown = getCooldownFromMessage(
              error.message,
              RESEND_COOLDOWN_SECONDS,
            );
            setCooldown(nextCooldown);
            setOtpError(`Superaste el límite. Esperá ${nextCooldown}s antes de volver a intentar.`);
          }
        }
      },
    });
  };

  return (
    <AuthScreenLayout
      title="Ingresá el código"
      subtitle={`Te enviamos un código de 6 dígitos a ${email ?? ""}.`}
      headerVariant="standard"
      backHref={backHref}
      footer={<View />}
    >
      <OtpInput
        onComplete={handleComplete}
        error={otpError}
        disabled={verifyEmail.isPending || cooldown > 0}
      />

      {/* Resend link */}
      <View
        style={{
          alignItems: "center",
          paddingTop: spacing.md,
          gap: spacing.sm,
        }}
      >
        {cooldown > 0 ? (
          <Typography
            size={14}
            lineHeight={20}
            weight="medium"
            color="textMuted"
            numeric="tabular"
          >
            Reenviar código en {cooldown}s
          </Typography>
        ) : (
          <Pressable
            onPress={handleResend}
            hitSlop={12}
            disabled={resendVerification.isPending}
            style={{ opacity: resendVerification.isPending ? 0.5 : 1 }}
          >
            {resendVerification.isPending ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Typography size={14} lineHeight={20} color="primary" weight="bold">
                  Enviando...
                </Typography>
              </View>
            ) : (
              <Typography size={14} lineHeight={20} color="primary" weight="bold">
                Reenviar código
              </Typography>
            )}
          </Pressable>
        )}

        {/* Resend success confirmation */}
        {resendSuccess && (
          <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
            <Typography size={12} lineHeight={16} letterSpacing={0.1} color="#22C55E" weight="medium">
              ¡Código reenviado!
            </Typography>
          </Animated.View>
        )}
      </View>
    </AuthScreenLayout>
  );
}
