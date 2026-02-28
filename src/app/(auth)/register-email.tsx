import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";

import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import { FormInput } from "@/components/ui/form-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { registerEmailSchema } from "@/features/auth/schemas/auth-schemas";
import { useRegisterFlowStore } from "@/stores/register-flow-store";

import type { RegisterEmailForm } from "@/features/auth/types";

export default function RegisterEmailScreen() {
  const { email, setEmail } = useRegisterFlowStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterEmailForm>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: { email },
  });

  const onSubmit = (data: RegisterEmailForm) => {
    setEmail(data.email.trim().toLowerCase());
    router.push("/(auth)/register-password" as never);
  };

  return (
    <AuthScreenLayout
      title="Ingresá tu email"
      footer={
        <PrimaryButton title="Continuar" onPress={handleSubmit(onSubmit)} />
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
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />
    </AuthScreenLayout>
  );
}
