import { View } from "react-native";

import { PrimaryButton } from "@/components/ui/primary-button";
import { spacing } from "@/constants/theme";
import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import { WelcomeStories } from "@/features/auth/components/welcome-stories";

interface AuthWelcomeProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function AuthWelcome({ onCreateAccount, onLogin }: AuthWelcomeProps) {
  return (
    <AuthScreenLayout
      headerVariant="landing"
      contentContainerStyle={{ flex: 1 }}
      footer={
        <View style={{ gap: spacing.md }}>
          <PrimaryButton title="Crear cuenta" onPress={onCreateAccount} />
          <PrimaryButton title="Ya tengo cuenta" onPress={onLogin} variant="secondary" />
        </View>
      }
    >
      <WelcomeStories />
    </AuthScreenLayout>
  );
}
