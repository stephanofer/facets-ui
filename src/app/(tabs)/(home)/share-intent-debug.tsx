import { Image } from "expo-image";
import { router } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/typography";
import { radius, spacing } from "@/constants/theme";
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
      <Typography
        size={12}
        lineHeight={16}
        letterSpacing={0.8}
        weight="medium"
        color="textMuted"
        style={{ textTransform: "uppercase" }}
      >
        {label}
      </Typography>
      <Typography
        size={14}
        lineHeight={20}
        color="text"
        weight="bold"
        selectable
      >
        {value != null ? String(value) : "—"}
      </Typography>
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
        <Typography size={24} lineHeight={32} letterSpacing={-0.4} weight="bold" color="text">
          Shared Content
        </Typography>
        <Typography size={14} lineHeight={20} weight="medium" color="textMuted">
          This is a debug screen to verify share intent is working correctly.
        </Typography>
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
          <Typography size={18} lineHeight={26} color="text" weight="bold">
            File Details
          </Typography>
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
          <Typography size={18} lineHeight={26} color="text" weight="bold">
            Metadata
          </Typography>
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
        <Typography
          size={12}
          lineHeight={16}
          letterSpacing={0.8}
          weight="medium"
          color="textMuted"
          style={{ textTransform: "uppercase" }}
        >
          Raw Share Intent (JSON)
        </Typography>
        <Typography
          family="mono"
          size={12}
          lineHeight={16}
          letterSpacing={0.1}
          weight="medium"
          color="text"
          selectable
        >
          {JSON.stringify(shareIntent, null, 2)}
        </Typography>
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
          <Typography size={16} lineHeight={24} color="#FFFFFF" weight="bold">
            Dismiss & Reset
          </Typography>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}
