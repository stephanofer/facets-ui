import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, Pressable, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { z } from "zod";

import { OtpInput } from "@/components/ui/otp-input";
import type { OtpInputVisualState } from "@/components/ui/otp-input";
import { Typography } from "@/components/ui/typography";
import { spacing } from "@/constants/theme";
import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import { useResendVerification } from "@/features/auth/hooks/use-resend-verification";
import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ApiError } from "@/lib/api-client";
import {
  showInvalidVerifyEmailEntryToast,
  showResendVerificationFailureToast,
  showVerifyEmailFailureToast,
} from "@/lib/toast";

const RESEND_COOLDOWN_SECONDS = 60;
const VERIFY_RETRY_COOLDOWN_SECONDS = 30;
const VERIFY_EMAIL_EXIT_TARGET = "/(auth)/welcome";

const verifyEmailParamsSchema = z.object({
  email: z.email(),
});

type VerifyEmailParams = z.infer<typeof verifyEmailParamsSchema>;
const BLOCKED_OTP_STATE: OtpInputVisualState = {
  kind: "blocked",
  message: "No pudimos abrir la verificacion desde este acceso.",
};

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

function getSingleRouteParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function parseVerifyEmailParams(params: {
  email?: string | string[];
}): VerifyEmailParams | null {
  const result = verifyEmailParamsSchema.safeParse({
    email: getSingleRouteParam(params.email)?.trim().toLowerCase(),
  });

  return result.success ? result.data : null;
}

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{
    email?: string | string[];
  }>();
  const { colors } = useAppTheme();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();
  const invalidEntryHandledRef = useRef(false);
  const verifyContext = parseVerifyEmailParams(params);

  const [otpError, setOtpError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleExit = useCallback(() => {
    router.replace(VERIFY_EMAIL_EXIT_TARGET as never);
  }, []);

  useEffect(() => {
    if (verifyContext || invalidEntryHandledRef.current) {
      return;
    }

    invalidEntryHandledRef.current = true;
    showInvalidVerifyEmailEntryToast();
    router.replace(VERIFY_EMAIL_EXIT_TARGET as never);
  }, [verifyContext]);

  useEffect(() => {
    if (!verifyContext) {
      return;
    }

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      handleExit();
      return true;
    });

    return () => subscription.remove();
  }, [handleExit, verifyContext]);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  useEffect(() => {
    if (!resendSuccess) {
      return;
    }

    const timer = setTimeout(() => setResendSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [resendSuccess]);

  const handleComplete = useCallback(
    (code: string) => {
      const email = verifyContext?.email;

      if (!email || verifyEmail.isPending) {
        return;
      }

      setOtpError("");
      verifyEmail.mutate(
        { email, code },
        {
          onError: (error) => {
            if (error instanceof ApiError) {
              switch (error.code) {
                case "INVALID_OTP":
                  setOtpError(error.message || "Código incorrecto");
                  showVerifyEmailFailureToast(error.message || "Código incorrecto.");
                  break;
                case "OTP_EXPIRED":
                  setOtpError("El código expiró. Pedí uno nuevo.");
                  showVerifyEmailFailureToast("El código expiró. Pedí uno nuevo.");
                  break;
                case "OTP_MAX_ATTEMPTS":
                  setCooldown(VERIFY_RETRY_COOLDOWN_SECONDS);
                  setOtpError("");
                  showVerifyEmailFailureToast("Demasiados intentos. Esperá antes de volver a intentar o reenviar.", {
                    title: "Demasiados intentos",
                    tone: "warning",
                  });
                  break;
                case "OTP_COOLDOWN":
                case "OTP_RATE_LIMITED": {
                  const nextCooldown = getCooldownFromMessage(error.message);
                  const message =
                    error.code === "OTP_RATE_LIMITED"
                      ? `Esperá ${nextCooldown}s antes de volver a intentar o reenviar.`
                      : error.message || `Esperá ${nextCooldown}s antes de volver a intentar.`;

                  setCooldown(nextCooldown);
                  setOtpError("");
                  showVerifyEmailFailureToast(message, {
                    title: "Esperá un momento",
                    tone: "warning",
                  });
                  break;
                }
                case "EMAIL_ALREADY_VERIFIED":
                  break;
                default:
                  setOtpError(error.message || "Algo salió mal");
                  showVerifyEmailFailureToast(error.message || "Intentá de nuevo.", {
                    title: "Algo salio mal",
                  });
              }
            } else {
              setOtpError("Error de conexión. Intentá de nuevo.");
              showVerifyEmailFailureToast("Verificá tu internet e intentá de nuevo.", {
                title: "Error de conexion",
              });
            }
          },
        },
      );
    },
    [verifyContext, verifyEmail],
  );

  const handleResend = () => {
    const email = verifyContext?.email;

    if (cooldown > 0 || !email || resendVerification.isPending || verifyEmail.isPending) {
      return;
    }

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
            const message = `Esperá ${nextCooldown}s antes de volver a intentar o reenviar.`;
            setCooldown(nextCooldown);
            showResendVerificationFailureToast(message, {
              title: "Esperá un momento",
              tone: "warning",
            });
          } else if (error.code === "OTP_RATE_LIMITED") {
            const nextCooldown = getCooldownFromMessage(
              error.message,
              RESEND_COOLDOWN_SECONDS,
            );
            const message = `Superaste el límite. Esperá ${nextCooldown}s antes de volver a intentar.`;
            setCooldown(nextCooldown);
            showResendVerificationFailureToast(message, {
              title: "Demasiados intentos",
              tone: "warning",
            });
          } else {
            const message = error.message || "No pudimos reenviar el código. Intentá de nuevo.";
            showResendVerificationFailureToast(message);
          }
        } else {
          const message = "No pudimos reenviar el código. Revisá tu conexión e intentá de nuevo.";
          showResendVerificationFailureToast(message, {
            title: "Error de conexion",
          });
        }
      },
    });
  };

  const otpState: OtpInputVisualState = !verifyContext
    ? BLOCKED_OTP_STATE
    : verifyEmail.isPending
      ? { kind: "verifying" }
      : otpError
        ? { kind: "error", message: otpError }
        : { kind: "idle" };

  if (!verifyContext) {
    return (
      <>
        <Stack.Screen options={{ gestureEnabled: false }} />
        <AuthScreenLayout
          title="Ingresá el código"
          subtitle="Volvé a iniciar sesión o registrate de nuevo para continuar."
          headerVariant="standard"
          onBackPress={handleExit}
          footer={<View />}
        >
          <OtpInput onComplete={() => {}} state={otpState} />
        </AuthScreenLayout>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <AuthScreenLayout
        title="Ingresá el código"
        subtitle={`Te enviamos un código de 6 dígitos a ${verifyContext.email}.`}
        headerVariant="standard"
        onBackPress={handleExit}
        footer={<View />}
      >
        <OtpInput
          onComplete={handleComplete}
          state={otpState}
          onChangeCode={() => {
            if (otpError) {
              setOtpError("");
            }
          }}
        />

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
              disabled={resendVerification.isPending || verifyEmail.isPending}
              style={{ opacity: resendVerification.isPending || verifyEmail.isPending ? 0.5 : 1 }}
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

          {resendSuccess && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
              <Typography size={12} lineHeight={16} letterSpacing={0.1} color="#22C55E" weight="medium">
                ¡Código reenviado!
              </Typography>
            </Animated.View>
          )}
        </View>
      </AuthScreenLayout>
    </>
  );
}
