import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import { OtpInput } from "@/components/ui/otp-input";
import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email";
import { useResendVerification } from "@/features/auth/hooks/use-resend-verification";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ApiError } from "@/lib/api-client";
import { fonts, spacing } from "@/constants/theme";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{
    email: string;
    source: "register" | "login";
  }>();
  const { colors } = useAppTheme();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleComplete = useCallback(
    (code: string) => {
      if (!email) return;
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
                  break;
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
    [email, verifyEmail],
  );

  const handleResend = () => {
    if (cooldown > 0 || !email) return;

    resendVerification.mutate(email, {
      onSuccess: () => {
        setCooldown(RESEND_COOLDOWN_SECONDS);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.code === "OTP_COOLDOWN") {
            // Parse seconds from server message or use default
            setCooldown(30);
          } else if (error.code === "OTP_RATE_LIMITED") {
            setOtpError("Superaste el límite de intentos por hora.");
          }
        }
      },
    });
  };

  return (
    <AuthScreenLayout
      title="Ingresá el código"
      subtitle={`Para verificar tu email, te enviamos un código a ${email ?? ""}.`}
      footer={<View />}
    >
      <OtpInput
        onComplete={handleComplete}
        error={otpError}
        disabled={verifyEmail.isPending}
      />

      {/* Resend link */}
      <View
        style={{
          alignItems: "center",
          paddingTop: spacing.md,
        }}
      >
        {cooldown > 0 ? (
          <Text
            style={{
              fontSize: fonts.sizes.sm,
              color: colors.textMuted,
              fontWeight: fonts.weights.medium,
              fontVariant: ["tabular-nums"],
            }}
          >
            Reenviar código en {cooldown}s
          </Text>
        ) : (
          <Pressable onPress={handleResend} hitSlop={12}>
            <Text
              style={{
                fontSize: fonts.sizes.sm,
                color: colors.primary,
                fontWeight: fonts.weights.semibold,
              }}
            >
              Reenviar código
            </Text>
          </Pressable>
        )}
      </View>

      {verifyEmail.isPending && (
        <Text
          style={{
            fontSize: fonts.sizes.sm,
            color: colors.textMuted,
            textAlign: "center",
          }}
        >
          Verificando...
        </Text>
      )}
    </AuthScreenLayout>
  );
}
