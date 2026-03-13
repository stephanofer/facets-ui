import { View } from "react-native";

import { PrimaryButton } from "@/components/ui/primary-button";
import { spacing } from "@/constants/theme";
import { AuthLandingStories } from "@/features/auth/components/auth-landing-stories";
import { AuthScreenLayout } from "@/features/auth/components/auth-screen-layout";
import {
  AUTH_LANDING_STORIES,
  AUTH_LANDING_STORY_AUTO_ADVANCE_MS,
} from "@/features/auth/constants/auth-landing-stories";

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
      <AuthLandingStories
        items={AUTH_LANDING_STORIES}
        autoAdvance
        durationMs={AUTH_LANDING_STORY_AUTO_ADVANCE_MS}
      />
    </AuthScreenLayout>
  );
}
