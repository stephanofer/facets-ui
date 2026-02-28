import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";

import { STORY_AUTO_ADVANCE_DURATION } from "@/features/onboarding/constants/onboarding-slides";

interface StoryProgressBarProps {
  totalSteps: number;
  currentStep: number;
  isPaused: boolean;
  onStepComplete: () => void;
}

export function StoryProgressBar({
  totalSteps,
  currentStep,
  isPaused,
  onStepComplete,
}: StoryProgressBarProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        paddingHorizontal: 16,
        paddingTop: 12,
      }}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <ProgressSegment
          key={index}
          index={index}
          currentStep={currentStep}
          isPaused={isPaused}
          isLastStep={index === totalSteps - 1}
          onComplete={onStepComplete}
        />
      ))}
    </View>
  );
}

interface ProgressSegmentProps {
  index: number;
  currentStep: number;
  isPaused: boolean;
  isLastStep: boolean;
  onComplete: () => void;
}

function ProgressSegment({
  index,
  currentStep,
  isPaused,
  isLastStep,
  onComplete,
}: ProgressSegmentProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (index < currentStep) {
      // Already completed — snap to full
      cancelAnimation(progress);
      progress.value = withTiming(1, { duration: 0 });
    } else if (index > currentStep) {
      // Not reached yet — reset
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 0 });
    } else if (isPaused && isLastStep) {
      // Last step completed its timer and paused — keep it full
      cancelAnimation(progress);
      progress.value = withTiming(1, { duration: 0 });
    } else {
      // Current step — animate from 0 to 1
      cancelAnimation(progress);
      progress.value = 0;

      if (!isPaused) {
        progress.value = withTiming(
          1,
          {
            duration: STORY_AUTO_ADVANCE_DURATION,
            easing: Easing.linear,
          },
          (finished) => {
            if (finished) {
              runOnJS(onComplete)();
            }
          },
        );
      }
    }
  }, [index, currentStep, isPaused, isLastStep]); // eslint-disable-line react-hooks/exhaustive-deps -- progress is a SharedValue (stable ref), onComplete is intentionally excluded to prevent re-triggering

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));

  return (
    <View
      style={{
        flex: 1,
        height: 3,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: 2,
            transformOrigin: "left center",
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
