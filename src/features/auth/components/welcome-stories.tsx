import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { radius } from "@/constants/theme";

import type { LayoutChangeEvent } from "react-native";
import type { SharedValue } from "react-native-reanimated";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** How long each story is displayed before auto-advancing (ms). */
const STORY_DURATION_MS = 5_000;

const PROGRESS_BAR_HEIGHT = 2.5;
const PROGRESS_BAR_GAP = 4;
const PROGRESS_INSET_TOP = 12;
const PROGRESS_INSET_HORIZONTAL = 12;

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

interface StorySlide {
  id: string;
  /** Placeholder fill colour — replace with Image / Video / animated SVG. */
  backgroundColor: string;
}

/**
 * Placeholder stories. Each entry will eventually hold an image, video,
 * or animated SVG source. For now they render as solid-colour fills so the
 * interaction logic can be validated without external assets.
 */
const STORIES: readonly StorySlide[] = [
  { id: "story-1", backgroundColor: "#0D9488" },
  { id: "story-2", backgroundColor: "#7C3AED" },
  { id: "story-3", backgroundColor: "#0EA5E9" },
  { id: "story-4", backgroundColor: "#F59E0B" },
];

// ---------------------------------------------------------------------------
// StoryProgressBar (private)
// ---------------------------------------------------------------------------

interface StoryProgressBarProps {
  index: number;
  activeIndex: number;
  progress: SharedValue<number>;
}

function StoryProgressBar({
  index,
  activeIndex,
  progress,
}: StoryProgressBarProps) {
  const barWidth = useSharedValue(0);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      barWidth.value = e.nativeEvent.layout.width;
    },
    [barWidth],
  );

  const fillStyle = useAnimatedStyle(() => {
    let fraction: number;

    if (index < activeIndex) {
      fraction = 1;
    } else if (index === activeIndex) {
      fraction = progress.value;
    } else {
      fraction = 0;
    }

    return { width: fraction * barWidth.value };
  });

  return (
    <View
      onLayout={handleLayout}
      style={{
        flex: 1,
        height: PROGRESS_BAR_HEIGHT,
        borderRadius: PROGRESS_BAR_HEIGHT / 2,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            borderRadius: PROGRESS_BAR_HEIGHT / 2,
            backgroundColor: "#FFFFFF",
          },
          fillStyle,
        ]}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// WelcomeStories
// ---------------------------------------------------------------------------

export function WelcomeStories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const progress = useSharedValue(0);

  const storyCount = STORIES.length;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === storyCount - 1;

  // --- Navigation helpers ------------------------------------------------

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, storyCount - 1));
  }, [storyCount]);

  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // --- Auto-advance via Reanimated timing --------------------------------

  useEffect(() => {
    progress.value = 0;

    if (isLast) {
      // Last story: animate progress bar to full but do NOT auto-advance.
      progress.value = withTiming(1, {
        duration: STORY_DURATION_MS,
        easing: Easing.linear,
      });
    } else {
      progress.value = withTiming(
        1,
        { duration: STORY_DURATION_MS, easing: Easing.linear },
        (finished) => {
          if (finished) {
            runOnJS(goToNext)();
          }
        },
      );
    }

    return () => {
      cancelAnimation(progress);
    };
  }, [activeIndex, isLast, progress, goToNext]);

  // --- Tap handlers ------------------------------------------------------

  const tapHaptic = useCallback(() => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const handleTapLeft = useCallback(() => {
    if (isFirst) return;
    tapHaptic();
    cancelAnimation(progress);
    progress.value = 0;
    goToPrevious();
  }, [isFirst, tapHaptic, progress, goToPrevious]);

  const handleTapRight = useCallback(() => {
    if (isLast) return;
    tapHaptic();
    cancelAnimation(progress);
    progress.value = 0;
    goToNext();
  }, [isLast, tapHaptic, progress, goToNext]);

  // --- Render ------------------------------------------------------------

  const currentStory = STORIES[activeIndex];

  return (
    <View
      style={{
        flex: 1,
        borderRadius: radius.xl,
        borderCurve: "continuous",
        overflow: "hidden",
      }}
    >
      {/* Story content — placeholder solid fill */}
      <View style={{ flex: 1, backgroundColor: currentStory.backgroundColor }} />

      {/* Progress indicators */}
      <View
        style={{
          position: "absolute",
          top: PROGRESS_INSET_TOP,
          left: PROGRESS_INSET_HORIZONTAL,
          right: PROGRESS_INSET_HORIZONTAL,
          flexDirection: "row",
          gap: PROGRESS_BAR_GAP,
          zIndex: 10,
        }}
      >
        {STORIES.map((story, i) => (
          <StoryProgressBar
            key={story.id}
            index={i}
            activeIndex={activeIndex}
            progress={progress}
          />
        ))}
      </View>

      {/* Invisible tap zone — left 35% (previous) */}
      <Pressable
        onPress={handleTapLeft}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "35%",
          zIndex: 5,
        }}
      />

      {/* Invisible tap zone — right 65% (next) */}
      <Pressable
        onPress={handleTapRight}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "65%",
          zIndex: 5,
        }}
      />
    </View>
  );
}
