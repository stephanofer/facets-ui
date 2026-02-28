import { router } from "expo-router";
import { useEffect } from "react";

import { AuthWelcome } from "@/features/auth/components/auth-welcome";
import { useRegisterFlowStore } from "@/stores/register-flow-store";

export default function WelcomeScreen() {
  const resetRegisterFlow = useRegisterFlowStore((s) => s.reset);

  // Clear any stale registration data whenever the user lands on welcome
  useEffect(() => {
    resetRegisterFlow();
  }, [resetRegisterFlow]);

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
