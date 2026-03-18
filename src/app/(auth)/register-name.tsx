import { useRef } from "react";
import { TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";

import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import { FormInput } from "@/components/ui/form-input";
import { PrimaryButton } from "@/components/ui/primary-button";
import { registerNameSchema } from "@/features/auth/schemas/auth-schemas";
import { useRegisterFlowStore } from "@/stores/register-flow-store";

import type { RegisterNameForm } from "@/features/auth/types";

export default function RegisterNameScreen() {
  const lastNameRef = useRef<TextInput>(null);
  const { firstName, lastName, setName } = useRegisterFlowStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterNameForm>({
    resolver: zodResolver(registerNameSchema),
    defaultValues: { firstName, lastName },
  });

  const onSubmit = (data: RegisterNameForm) => {
    setName(data.firstName, data.lastName);
    router.push("/(auth)/register-email" as never);
  };

  return (
    <AuthScreenLayout
      title="¿Cómo te llamás?"
      headerVariant="standard"
      backHref="/(auth)/welcome"
      registerProgress={{ currentStep: 1, totalSteps: 3 }}
      footer={
        <PrimaryButton title="Continuar" onPress={handleSubmit(onSubmit)} />
      }
    >
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            label="Nombre"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.firstName?.message}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => lastNameRef.current?.focus()}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            ref={lastNameRef}
            label="Apellido"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.lastName?.message}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            blurOnSubmit={false}
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />
    </AuthScreenLayout>
  );
}
