import { useCallback } from "react";
import { router } from "expo-router";

import { OnboardingStories } from "@/features/onboarding/components/onboarding-stories";
import { useOnboardingStore } from "@/stores/onboarding-store";

export default function OnboardingScreen() {
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const handleComplete = useCallback(() => {
    completeOnboarding();
    router.replace("/(auth)/welcome" as never);
  }, [completeOnboarding]);

  return <OnboardingStories onComplete={handleComplete} />;
}
