import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native";

import { FormInput } from "@/components/ui/form-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema } from "@/features/auth/schemas/auth-schemas";
import { ApiError } from "@/lib/api-client";
import { showErrorToast, showNetworkToast, showWarningToast } from "@/lib/toast";

import type { LoginRequest } from "@/features/auth/types";

export default function LoginScreen() {
  const passwordRef = useRef<TextInput>(null);
  const login = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const showLoginErrorToast = (title: string, description: string) => {
    showErrorToast(title, description);
  };

  const onSubmit = (data: LoginRequest) => {
    login.mutate(data, {
      onSuccess: () => {
        // Belt-and-suspenders: the root layout also watches authStatus,
        // but explicitly navigate here to avoid race conditions where
        // the root layout effect doesn't fire in time.
        router.replace("/(tabs)/(home)" as never);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          switch (error.code) {
            case "EMAIL_NOT_VERIFIED":
              // User registered but never verified — send to OTP screen
              router.push({
                pathname: "/(auth)/verify-email" as never,
                params: {
                  email: getValues("email").trim().toLowerCase(),
                  source: "login",
                },
              });
              break;
            case "INVALID_CREDENTIALS":
              showLoginErrorToast(
                "No pudimos iniciar sesion",
                "Email o contrasena incorrectos.",
              );
              break;
            case "ACCOUNT_SUSPENDED":
              showLoginErrorToast(
                "No pudimos iniciar sesion",
                "Tu cuenta ha sido suspendida. Contacta soporte.",
              );
              break;
            case "ACCOUNT_DELETED":
              showLoginErrorToast(
                "No pudimos iniciar sesion",
                "Esta cuenta ya no existe.",
              );
              break;
            case "RATE_LIMIT_EXCEEDED":
              showWarningToast(
                "Demasiados intentos",
                "Demasiados intentos. Esperá un momento e intentá de nuevo.",
              );
              break;
            case "VALIDATION_ERROR":
              showLoginErrorToast(
                "Revisa los datos",
                error.details?.map((detail) => detail.message).join(". ") ??
                  error.message,
              );
              break;
            default:
              showLoginErrorToast(
                "Algo salio mal",
                error.message || "Intenta de nuevo.",
              );
          }
        } else {
          showNetworkToast("Verifica tu internet e intenta de nuevo.");
        }
      },
    });
  };

  return (
    <AuthScreenLayout
      title="Iniciá sesión"
      subtitle="Ingresá tus datos para acceder a tu cuenta."
      headerVariant="standard"
      backHref="/(auth)/welcome"
      footer={
        <PrimaryButton
          title="Iniciar sesión"
          onPress={handleSubmit(onSubmit)}
          loading={login.isPending}
          disabled={login.isPending}
        />
      }
    >
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            ref={passwordRef}
            label="Contraseña"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />
    </AuthScreenLayout>
  );
}
