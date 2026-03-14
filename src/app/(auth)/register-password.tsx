import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native";

import { FormInput } from "@/components/ui/form-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import { useRegister } from "@/features/auth/hooks/use-register";
import { registerPasswordSchema } from "@/features/auth/schemas/auth-schemas";
import { ApiError } from "@/lib/api-client";
import { showErrorToast, showNetworkToast, showWarningToast } from "@/lib/toast";
import { useRegisterFlowStore } from "@/stores/register-flow-store";

import type { RegisterPasswordForm } from "@/features/auth/types";

export default function RegisterPasswordScreen() {
  const confirmRef = useRef<TextInput>(null);
  const { firstName, lastName, email, setPassword } = useRegisterFlowStore();
  const register = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPasswordForm>({
    resolver: zodResolver(registerPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const showRegisterErrorToast = (title: string, description: string) => {
    showErrorToast(title, description);
  };

  const onSubmit = (data: RegisterPasswordForm) => {
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
                showRegisterErrorToast(
                  "No pudimos crear la cuenta",
                  "Este email ya esta registrado. Intenta iniciar sesion.",
                );
                break;
              case "VALIDATION_ERROR":
                showRegisterErrorToast(
                  "Revisa los datos",
                  error.details?.map((detail) => detail.message).join(". ") ??
                    error.message,
                );
                break;
              case "RATE_LIMIT_EXCEEDED":
                showWarningToast(
                  "Demasiados intentos",
                  "Demasiados intentos. Esperá un momento e intentá de nuevo.",
                );
                break;
              default:
                showRegisterErrorToast(
                  "Algo salio mal",
                  error.message || "Intenta de nuevo.",
                );
            }
          } else {
            showNetworkToast("Verifica tu internet e intenta de nuevo.");
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
    </AuthScreenLayout>
  );
}
