import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeOutUp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ToastCard } from "@/components/ui/toast/toast-card";
import { spacing } from "@/constants/theme";
import { useToastStore } from "@/stores/toast-store";

import type { ToastRecord } from "@/components/ui/toast/toast-types";

const EXIT_DURATION_MS = 170;
const SWIPE_DISMISS_THRESHOLD = 112;

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const current = useToastStore((state) => state.current);
  const queue = useToastStore((state) => state.queue);
  const dismiss = useToastStore((state) => state.dismiss);
  const shiftNext = useToastStore((state) => state.shiftNext);

  const [renderedToast, setRenderedToast] = useState<ToastRecord | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translateX = useSharedValue(0);

  const clearTimers = useCallback(() => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }

    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  const handleDismiss = useCallback(() => {
    if (!renderedToast) {
      return;
    }

    dismiss(renderedToast.id);
    setIsVisible(false);
  }, [dismiss, renderedToast]);

  useEffect(() => {
    if (!renderedToast && current) {
      translateX.value = 0;
      setRenderedToast(current);
      setIsVisible(true);
    }
  }, [current, renderedToast, translateX]);

  useEffect(() => {
    if (renderedToast && current?.id === renderedToast.id) {
      setIsVisible(true);
    }

    if (renderedToast && !current && isVisible) {
      setIsVisible(false);
    }
  }, [current, isVisible, renderedToast]);

  useEffect(() => {
    if (!renderedToast || !isVisible) {
      return;
    }

    if (process.env.EXPO_OS === "ios") {
      if (renderedToast.variant === "success") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (renderedToast.variant === "error") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (renderedToast.variant === "warning") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }

    if (renderedToast.durationMs !== null) {
      autoDismissTimerRef.current = setTimeout(() => {
        dismiss(renderedToast.id);
        setIsVisible(false);
      }, renderedToast.durationMs);
    }

    return () => {
      if (autoDismissTimerRef.current) {
        clearTimeout(autoDismissTimerRef.current);
        autoDismissTimerRef.current = null;
      }
    };
  }, [dismiss, isVisible, renderedToast]);

  useEffect(() => {
    if (isVisible || !renderedToast) {
      return;
    }

    exitTimerRef.current = setTimeout(() => {
      translateX.value = 0;
      setRenderedToast(null);

      if (!useToastStore.getState().current) {
        shiftNext();
      }
    }, EXIT_DURATION_MS);

    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [isVisible, renderedToast, shiftNext, translateX]);

  useEffect(() => clearTimers, [clearTimers]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-16, 16])
        .onUpdate((event) => {
          translateX.value = event.translationX;
        })
        .onEnd((event) => {
          if (Math.abs(event.translationX) >= SWIPE_DISMISS_THRESHOLD) {
            translateX.value = withSpring(
              event.translationX > 0 ? 420 : -420,
              { damping: 18, stiffness: 180 },
            );
            runOnJS(handleDismiss)();
            return;
          }

          translateX.value = withSpring(0, {
            damping: 18,
            stiffness: 220,
          });
        }),
    [handleDismiss, translateX],
  );

  const gestureStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-180, 0, 180],
      [-5, 0, 5],
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  if (!renderedToast) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        paddingTop: insets.top + spacing.sm,
        paddingHorizontal: spacing.md,
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          entering={FadeInDown.duration(220)}
          exiting={FadeOutUp.duration(EXIT_DURATION_MS)}
          style={gestureStyle}
        >
          <ToastCard toast={renderedToast} onDismiss={handleDismiss} />
        </Animated.View>
      </GestureDetector>

      {queue.length > 0 ? <View pointerEvents="none" style={{ height: 6 }} /> : null}
    </View>
  );
}
