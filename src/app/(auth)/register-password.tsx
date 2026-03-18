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
import { showRegisterFailureToast } from "@/lib/toast";
import { useRegisterFlowStore } from "@/stores/register-flow-store";

import type { RegisterPasswordForm } from "@/features/auth/types";

export default function RegisterPasswordScreen() {
  const confirmRef = useRef<TextInput>(null);
  const { firstName, lastName, email, setPassword } = useRegisterFlowStore();
  const register = useRegister();
  const normalizedEmail = email.trim().toLowerCase();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPasswordForm>({
    resolver: zodResolver(registerPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (data: RegisterPasswordForm) => {
    setPassword(data.password);

    register.mutate(
      {
        firstName,
        lastName,
        email: normalizedEmail,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.dismissAll();
          router.push({
            pathname: "/(auth)/verify-email" as never,
            params: {
              email: normalizedEmail,
            },
          });
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            switch (error.code) {
              case "EMAIL_ALREADY_EXISTS":
                showRegisterFailureToast(
                  "Este email ya esta registrado. Intenta iniciar sesion.",
                );
                break;
              case "VALIDATION_ERROR":
                showRegisterFailureToast(
                  error.details?.map((detail) => detail.message).join(". ") ??
                    error.message,
                  { title: "Revisa los datos" },
                );
                break;
              case "RATE_LIMIT_EXCEEDED":
                showRegisterFailureToast(
                  "Demasiados intentos. Esperá un momento e intentá de nuevo.",
                  { title: "Demasiados intentos", tone: "warning" },
                );
                break;
              default:
                showRegisterFailureToast(
                  error.message || "Intenta de nuevo.",
                  { title: "Algo salio mal" },
                );
            }
          } else {
            showRegisterFailureToast("Verifica tu internet e intenta de nuevo.", {
              title: "Error de conexion",
            });
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
            blurOnSubmit={false}
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
            blurOnSubmit={false}
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />
    </AuthScreenLayout>
  );
}
