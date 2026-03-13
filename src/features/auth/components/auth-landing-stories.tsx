import { Image } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { radius, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

import { AuthLandingStoryProgress } from "./auth-landing-story-progress";

import type { AuthLandingStoryItem } from "@/features/auth/constants/auth-landing-stories";

const SPRING_CONFIG = { damping: 20, stiffness: 300 };

interface AuthLandingStoriesProps {
  items: AuthLandingStoryItem[];
  autoAdvance?: boolean;
  durationMs: number;
}

export function AuthLandingStories({
  items,
  autoAdvance = true,
  durationMs,
}: AuthLandingStoriesProps) {
  const { colors, isDark } = useAppTheme();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const currentStory = items[currentIndex];
  const isLastStory = currentIndex === items.length - 1;

  const goToIndex = useCallback(
    (nextIndex: number) => {
      const safeIndex = Math.max(0, Math.min(nextIndex, items.length - 1));
      setCurrentIndex(safeIndex);
    },
    [items.length],
  );

  const goToNext = useCallback(() => {
    if (isLastStory) {
      return;
    }

    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex, isLastStory]);

  const goToPrevious = useCallback(() => {
    if (currentIndex === 0) {
      return;
    }

    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  const handleStepComplete = useCallback(() => {
    if (!autoAdvance || isLastStory) {
      return;
    }

    goToNext();
  }, [autoAdvance, goToNext, isLastStory]);

  const tapGesture = useMemo(
    () =>
      Gesture.Tap().onEnd((event) => {
        if (event.x < width / 2) {
          runOnJS(goToPrevious)();
          return;
        }

        runOnJS(goToNext)();
      }),
    [goToNext, goToPrevious, width],
  );

  const longPressGesture = useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(150)
        .onStart(() => {
          scale.value = withSpring(0.985, SPRING_CONFIG);
          runOnJS(setIsPaused)(true);
        })
        .onEnd(() => {
          scale.value = withSpring(1, SPRING_CONFIG);
          runOnJS(setIsPaused)(false);
        }),
    [scale],
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .onUpdate((event) => {
          const atStart = currentIndex === 0 && event.translationX > 0;
          const atEnd = isLastStory && event.translationX < 0;

          translateX.value = atStart || atEnd
            ? event.translationX * 0.2
            : event.translationX * 0.4;
        })
        .onEnd((event) => {
          const threshold = 40;

          if (event.translationX < -threshold && !isLastStory) {
            runOnJS(goToNext)();
          } else if (event.translationX > threshold && currentIndex > 0) {
            runOnJS(goToPrevious)();
          }

          translateX.value = withSpring(0, SPRING_CONFIG);
        }),
    [currentIndex, goToNext, goToPrevious, isLastStory, translateX],
  );

  const composedGesture = useMemo(
    () => Gesture.Race(panGesture, Gesture.Exclusive(longPressGesture, tapGesture)),
    [longPressGesture, panGesture, tapGesture],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <View
      style={{
        gap: spacing.lg,
        borderRadius: radius.xl,
        borderCurve: "continuous",
        backgroundColor: isDark ? colors.card : "#FFFFFF",
        padding: spacing.lg,
        boxShadow: isDark ? undefined : "0 8px 24px rgba(15, 23, 42, 0.08)",
        borderWidth: isDark ? 1 : 0,
        borderColor: colors.border,
      }}
    >
      <AuthLandingStoryProgress
        totalSteps={items.length}
        currentStep={currentIndex}
        isPaused={isPaused}
        durationMs={durationMs}
        autoAdvance={autoAdvance}
        onStepComplete={handleStepComplete}
      />

      <GestureDetector gesture={composedGesture}>
        <Animated.View style={animatedStyle}>
          <Animated.View
            key={currentStory.id}
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(140)}
            style={{ gap: spacing.lg }}
          >
            <Animated.View
              entering={FadeIn.duration(240)}
              style={{
                width: "100%",
                aspectRatio: 1.2,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: radius.xl,
                borderCurve: "continuous",
                overflow: "hidden",
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(13, 148, 136, 0.08)",
              }}
            >
              <Image
                source={currentStory.image}
                style={{ width: "78%", height: "78%" }}
                contentFit="contain"
                transition={180}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
