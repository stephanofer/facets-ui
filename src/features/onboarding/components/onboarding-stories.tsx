import { useCallback, useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

import { StoryProgressBar } from "@/features/onboarding/components/story-progress-bar";
import {
  ONBOARDING_SLIDES,
  type OnboardingSlide,
} from "@/features/onboarding/constants/onboarding-slides";
import { colors, fonts, radius, spacing } from "@/constants/theme";

const SPRING_CONFIG = { damping: 20, stiffness: 300 };

interface OnboardingStoriesProps {
  onComplete: () => void;
}

export function OnboardingStories({ onComplete }: OnboardingStoriesProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;
  const slide = ONBOARDING_SLIDES[currentIndex];

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const goToNext = useCallback(() => {
    if (isLastSlide) return;
    triggerHaptic();
    setCurrentIndex((prev) => Math.min(prev + 1, ONBOARDING_SLIDES.length - 1));
  }, [isLastSlide, triggerHaptic]);

  const goToPrev = useCallback(() => {
    if (currentIndex === 0) return;
    triggerHaptic();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, [currentIndex, triggerHaptic]);

  const handleStepComplete = useCallback(() => {
    if (!isLastSlide) {
      triggerHaptic();
      setCurrentIndex((prev) =>
        Math.min(prev + 1, ONBOARDING_SLIDES.length - 1),
      );
    } else {
      // On last slide, just pause — user must tap the button
      setIsPaused(true);
    }
  }, [isLastSlide, triggerHaptic]);

  const handleComplete = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  }, [onComplete]);

  // Tap gesture — left third = prev, right third = next (only if not last)
  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      const tapX = event.x;
      const leftThreshold = width * 0.33;
      const rightThreshold = width * 0.67;

      if (tapX < leftThreshold) {
        runOnJS(goToPrev)();
      } else if (tapX > rightThreshold && !isLastSlide) {
        runOnJS(goToNext)();
      }
    });

  // Long press — pause while holding
  const longPressGesture = Gesture.LongPress()
    .minDuration(150)
    .onStart(() => {
      scale.value = withSpring(0.98, SPRING_CONFIG);
      runOnJS(setIsPaused)(true);
    })
    .onEnd(() => {
      scale.value = withSpring(1, SPRING_CONFIG);
      runOnJS(setIsPaused)(false);
    });

  // Pan gesture for swipe navigation
  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate((event) => {
      // Resistance at boundaries
      const isAtStart = currentIndex === 0 && event.translationX > 0;
      const isAtEnd = isLastSlide && event.translationX < 0;

      if (isAtStart || isAtEnd) {
        translateX.value = event.translationX * 0.2; // Rubber band
      } else {
        translateX.value = event.translationX * 0.4;
      }
    })
    .onEnd((event) => {
      const threshold = width * 0.15;

      if (event.translationX < -threshold && !isLastSlide) {
        runOnJS(goToNext)();
      } else if (event.translationX > threshold && currentIndex > 0) {
        runOnJS(goToPrev)();
      }

      translateX.value = withSpring(0, SPRING_CONFIG);
    });

  const composedGesture = Gesture.Race(
    panGesture,
    Gesture.Exclusive(longPressGesture, tapGesture),
  );

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.dark.background }}>
      {/* Progress bar */}
      <View
        style={{
          position: "absolute",
          top: insets.top,
          left: 0,
          right: 0,
          zIndex: 20,
        }}
      >
        <StoryProgressBar
          totalSteps={ONBOARDING_SLIDES.length}
          currentStep={currentIndex}
          isPaused={isPaused}
          onStepComplete={handleStepComplete}
        />
      </View>

      {/* Close button */}
      <Pressable
        onPress={handleComplete}
        hitSlop={16}
        style={{
          position: "absolute",
          top: insets.top + 24,
          right: spacing.lg,
          zIndex: 20,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: fonts.weights.semibold,
            lineHeight: 18,
          }}
        >
          ✕
        </Text>
      </Pressable>

      {/* Main content with gesture handling */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[{ flex: 1 }, containerAnimatedStyle]}>
          <SlideContent
            key={slide.id}
            slide={slide}
            isLast={isLastSlide}
            onComplete={handleComplete}
            bottomInset={insets.bottom}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

interface SlideContentProps {
  slide: OnboardingSlide;
  isLast: boolean;
  onComplete: () => void;
  bottomInset: number;
}

function SlideContent({
  slide,
  isLast,
  onComplete,
  bottomInset,
}: SlideContentProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(150)}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.xl,
        gap: spacing["3xl"],
      }}
    >
      {/* Image */}
      <Animated.View
        entering={FadeInUp.duration(300).delay(50)}
        style={{
          width: 280,
          height: 280,
          borderRadius: radius.xl,
          borderCurve: "continuous",
          overflow: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={slide.image}
          style={{ width: 240, height: 240 }}
          contentFit="contain"
          transition={200}
        />
      </Animated.View>

      {/* Text content */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(100)}
        style={{
          alignItems: "center",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
        }}
      >
        <Text
          selectable
          style={{
            color: "#FFFFFF",
            fontSize: fonts.sizes["3xl"],
            fontWeight: fonts.weights.bold,
            textAlign: "center",
            letterSpacing: -0.5,
          }}
        >
          {slide.title}
        </Text>
        <Text
          selectable
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.regular,
            textAlign: "center",
            lineHeight: 26,
          }}
        >
          {slide.description}
        </Text>
      </Animated.View>

      {/* CTA Button — always visible, but changes emphasis on last slide */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(150)}
        style={{
          position: "absolute",
          bottom: bottomInset + spacing["2xl"],
          left: spacing.xl,
          right: spacing.xl,
        }}
      >
        <Pressable
          onPress={onComplete}
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? isLast
                ? "#4AE0C4"
                : "rgba(255, 255, 255, 0.2)"
              : isLast
                ? colors.dark.primary
                : "rgba(255, 255, 255, 0.12)",
            height: 56,
            borderRadius: radius.lg,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: isLast ? 0 : 1,
            borderColor: "rgba(255, 255, 255, 0.15)",
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Text
            style={{
              color: isLast ? colors.dark.background : "#FFFFFF",
              fontSize: fonts.sizes.lg,
              fontWeight: fonts.weights.semibold,
              letterSpacing: 0.3,
            }}
          >
            Comenzar
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
