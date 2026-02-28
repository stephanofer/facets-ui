import { router } from "expo-router";

import { AuthWelcome } from "@/features/auth/components/auth-welcome";

export default function WelcomeScreen() {
  const handleCreateAccount = () => {
    // TODO: Navigate to register screen
    router.replace("/(tabs)/(home)" as never);
  };

  const handleLogin = () => {
    // TODO: Navigate to login screen
    router.replace("/(tabs)/(home)" as never);
  };

  return (
    <AuthWelcome
      onCreateAccount={handleCreateAccount}
      onLogin={handleLogin}
    />
  );
}
