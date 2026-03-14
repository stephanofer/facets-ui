import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native";

import { FormInput } from "@/components/ui/form-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Typography } from "@/components/ui/typography";
import { spacing } from "@/constants/theme";
import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import { useRegister } from "@/features/auth/hooks/use-register";
import { registerPasswordSchema } from "@/features/auth/schemas/auth-schemas";
import { ApiError } from "@/lib/api-client";
import { useRegisterFlowStore } from "@/stores/register-flow-store";

import type { RegisterPasswordForm } from "@/features/auth/types";

export default function RegisterPasswordScreen() {
  const confirmRef = useRef<TextInput>(null);
  const { firstName, lastName, email, setPassword } = useRegisterFlowStore();
  const register = useRegister();
  const [serverError, setServerError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPasswordForm>({
    resolver: zodResolver(registerPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: RegisterPasswordForm) => {
    setServerError("");
    setPassword(data.password);

    register.mutate(
      {
        firstName,
        lastName,
        email,
        password: data.password,
      },
      {
        onSuccess: () => {
          // Go to OTP verification
          router.push({
            pathname: "/(auth)/verify-email" as never,
            params: { email, source: "register" },
          });
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            switch (error.code) {
              case "EMAIL_ALREADY_EXISTS":
                setServerError(
                  "Este email ya está registrado. Intentá iniciar sesión.",
                );
                break;
              case "VALIDATION_ERROR":
                setServerError(
                  error.details?.map((d) => d.message).join("\n") ??
                    error.message,
                );
                break;
              case "RATE_LIMIT_EXCEEDED":
                setServerError(
                  "Demasiados intentos. Esperá un momento e intentá de nuevo.",
                );
                break;
              default:
                setServerError(error.message || "Algo salió mal. Intentá de nuevo.");
            }
          } else {
            setServerError("Error de conexión. Verificá tu internet.");
          }
        },
      },
    );
  };

  return (
    <AuthScreenLayout
      title="Creá tu contraseña"
      subtitle="Mínimo 8 caracteres con mayúscula, minúscula y número."
      headerVariant="standard"
      backHref="/(auth)/register-email"
      registerProgress={{ currentStep: 3, totalSteps: 3 }}
      footer={
        <PrimaryButton
          title="Crear cuenta"
          onPress={handleSubmit(onSubmit)}
          loading={register.isPending}
          disabled={register.isPending}
        />
      }
    >
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Contraseña"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            ref={confirmRef}
            label="Repetir contraseña"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />

      {serverError !== "" && (
        <Typography
          size={14}
          lineHeight={20}
          weight="medium"
          color="#EF4444"
          selectable
          align="center"
          style={{ paddingTop: spacing.sm }}
        >
          {serverError}
        </Typography>
      )}
    </AuthScreenLayout>
  );
}
