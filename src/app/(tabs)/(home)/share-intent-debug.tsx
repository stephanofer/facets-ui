import { Image } from "expo-image";
import { router } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fonts, radius, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

function InfoRow({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string | number | null | undefined;
  delay?: number;
}) {
  const { colors, isDark } = useAppTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(delay)}
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.md,
        borderCurve: "continuous",
        padding: spacing.lg,
        gap: spacing.xs,
        boxShadow: isDark ? undefined : "0 1px 3px rgba(0, 0, 0, 0.06)",
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : "transparent",
      }}
    >
      <Text
        style={{
          fontSize: fonts.sizes.xs,
          fontWeight: fonts.weights.medium,
          color: colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
      <Text
        selectable
        style={{
          fontSize: fonts.sizes.sm,
          fontWeight: fonts.weights.semibold,
          color: colors.text,
        }}
      >
        {value != null ? String(value) : "—"}
      </Text>
    </Animated.View>
  );
}

export default function ShareIntentDebugScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { shareIntent, resetShareIntent } = useShareIntentContext();

  const file = shareIntent.files?.[0];

  const handleDismiss = () => {
    resetShareIntent();
    router.back();
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: spacing.xl,
        gap: spacing.lg,
        paddingTop:
          process.env.EXPO_OS === "android" ? insets.top + spacing.xl : spacing.xl,
        paddingBottom: insets.bottom + spacing["3xl"],
      }}
    >
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(200)}
        style={{ gap: spacing.xs }}
      >
        <Text
          style={{
            fontSize: fonts.sizes["2xl"],
            fontWeight: fonts.weights.bold,
            color: colors.text,
            letterSpacing: -0.5,
          }}
        >
          Shared Content
        </Text>
        <Text
          style={{
            fontSize: fonts.sizes.sm,
            fontWeight: fonts.weights.medium,
            color: colors.textMuted,
          }}
        >
          This is a debug screen to verify share intent is working correctly.
        </Text>
      </Animated.View>

      {/* Shared Image Preview */}
      {file?.path ? (
        <Animated.View
          entering={FadeInDown.duration(200).delay(50)}
          style={{
            borderRadius: radius.lg,
            borderCurve: "continuous",
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: file.path }}
            style={{
              width: "100%",
              aspectRatio: file.width && file.height
                ? file.width / file.height
                : 4 / 3,
              borderRadius: radius.lg,
            }}
            contentFit="cover"
          />
        </Animated.View>
      ) : null}

      {/* Text content (if shared text/URL instead of image) */}
      {shareIntent.text ? (
        <InfoRow label="Shared Text" value={shareIntent.text} delay={100} />
      ) : null}

      {shareIntent.webUrl ? (
        <InfoRow label="Web URL" value={shareIntent.webUrl} delay={150} />
      ) : null}

      {/* File metadata */}
      {file ? (
        <View style={{ gap: spacing.md }}>
          <Text
            style={{
              fontSize: fonts.sizes.lg,
              fontWeight: fonts.weights.semibold,
              color: colors.text,
            }}
          >
            File Details
          </Text>
          <InfoRow label="File Name" value={file.fileName} delay={200} />
          <InfoRow label="MIME Type" value={file.mimeType} delay={250} />
          <InfoRow
            label="File Size"
            value={
              file.size
                ? `${(file.size / 1024).toFixed(1)} KB (${file.size} bytes)`
                : null
            }
            delay={300}
          />
          <InfoRow label="File Path" value={file.path} delay={350} />
          {file.width ? (
            <InfoRow
              label="Dimensions"
              value={`${file.width} × ${file.height} px`}
              delay={400}
            />
          ) : null}
          {file.duration ? (
            <InfoRow
              label="Duration"
              value={`${(file.duration / 1000).toFixed(1)}s`}
              delay={450}
            />
          ) : null}
        </View>
      ) : null}

      {/* Meta information */}
      {shareIntent.meta ? (
        <View style={{ gap: spacing.md }}>
          <Text
            style={{
              fontSize: fonts.sizes.lg,
              fontWeight: fonts.weights.semibold,
              color: colors.text,
            }}
          >
            Metadata
          </Text>
          {Object.entries(shareIntent.meta).map(([key, value], index) => (
            <InfoRow
              key={key}
              label={key}
              value={value as string}
              delay={500 + index * 50}
            />
          ))}
        </View>
      ) : null}

      {/* Raw JSON dump for full debugging */}
      <Animated.View
        entering={FadeInDown.duration(200).delay(600)}
        style={{
          backgroundColor: colors.card,
          borderRadius: radius.md,
          borderCurve: "continuous",
          padding: spacing.lg,
          gap: spacing.sm,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: fonts.sizes.xs,
            fontWeight: fonts.weights.medium,
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Raw Share Intent (JSON)
        </Text>
        <Text
          selectable
          style={{
            fontSize: fonts.sizes.xs,
            color: colors.text,
            fontWeight: fonts.weights.regular,
            fontFamily: process.env.EXPO_OS === "ios" ? "Menlo" : "monospace",
          }}
        >
          {JSON.stringify(shareIntent, null, 2)}
        </Text>
      </Animated.View>

      {/* Dismiss button */}
      <Animated.View entering={FadeInDown.duration(200).delay(650)}>
        <Pressable
          onPress={handleDismiss}
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.primary + "DD" : colors.primary,
            height: 52,
            borderRadius: radius.lg,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: fonts.sizes.md,
              fontWeight: fonts.weights.semibold,
            }}
          >
            Dismiss & Reset
          </Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}
