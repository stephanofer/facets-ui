import { router } from "expo-router";

import { AuthWelcome } from "@/features/auth/components/auth-welcome";

export default function WelcomeScreen() {
  const handleCreateAccount = () => {
    router.push("/(auth)/register-name" as never);
  };

  const handleLogin = () => {
    router.push("/(auth)/login" as never);
  };

  return (
    <AuthWelcome
      onCreateAccount={handleCreateAccount}
      onLogin={handleLogin}
    />
  );
}
