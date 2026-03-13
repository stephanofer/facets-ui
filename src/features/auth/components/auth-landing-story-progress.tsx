import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import { spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

interface AuthLandingStoryProgressProps {
  totalSteps: number;
  currentStep: number;
  isPaused: boolean;
  durationMs: number;
  autoAdvance: boolean;
  onStepComplete: () => void;
}

const FRAME_MS = 50;

export function AuthLandingStoryProgress({
  totalSteps,
  currentStep,
  isPaused,
  durationMs,
  autoAdvance,
  onStepComplete,
}: AuthLandingStoryProgressProps) {
  return (
    <View style={{ flexDirection: "row", gap: spacing.xs }}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <ProgressSegment
          key={`auth-story-progress-${index}`}
          index={index}
          currentStep={currentStep}
          isPaused={isPaused}
          durationMs={durationMs}
          autoAdvance={autoAdvance}
          onStepComplete={onStepComplete}
        />
      ))}
    </View>
  );
}

interface ProgressSegmentProps {
  index: number;
  currentStep: number;
  isPaused: boolean;
  durationMs: number;
  autoAdvance: boolean;
  onStepComplete: () => void;
}

function ProgressSegment({
  index,
  currentStep,
  isPaused,
  durationMs,
  autoAdvance,
  onStepComplete,
}: ProgressSegmentProps) {
  const { colors } = useAppTheme();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previousStepRef = useRef(currentStep);
  const [progress, setProgress] = useState(index < currentStep ? 1 : 0);

  const isActive = index === currentStep;
  const shouldRun = isActive && autoAdvance && !isPaused;

  useEffect(() => {
    if (index < currentStep) {
      setProgress(1);
      previousStepRef.current = currentStep;
      return;
    }

    if (index > currentStep) {
      setProgress(0);
      previousStepRef.current = currentStep;
      return;
    }

    if (previousStepRef.current !== currentStep) {
      setProgress(0);
      previousStepRef.current = currentStep;
      return;
    }

    setProgress((currentValue) => currentValue);
  }, [currentStep, index]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!shouldRun) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress((previous) => {
        const next = Math.min(previous + FRAME_MS / durationMs, 1);

        if (next >= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          queueMicrotask(onStepComplete);
        }

        return next;
      });
    }, FRAME_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [durationMs, onStepComplete, shouldRun]);

  const widthPercentage = `${Math.round(progress * 100)}%` as `${number}%`;

  return (
    <View
      style={{
        flex: 1,
        height: 4,
        borderRadius: 999,
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.18)",
      }}
    >
      <View
        style={{
          width: widthPercentage,
          height: "100%",
          borderRadius: 999,
          backgroundColor: progress > 0 ? colors.primary : "transparent",
        }}
      />
    </View>
  );
}
