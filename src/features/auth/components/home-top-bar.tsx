import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AdaptiveGlassView } from "@/components/ui/adaptive-glass-view";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { UserAvatar } from "@/components/ui/user-avatar";
import { spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

interface HomeTopBarProps {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  workspaceLabel?: string;
  workspaceRole?: string;
  planName?: string;
}

function ContextChip({ label }: { label: string }) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      style={{
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        borderRadius: 999,
        borderCurve: "continuous",
        backgroundColor: isDark ? colors.card : "rgba(15, 23, 42, 0.04)",
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Typography size={12} lineHeight={16} weight="medium" color="textMuted">
        {label}
      </Typography>
    </View>
  );
}

function HeaderAction({
  icon,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
}) {
  const { colors } = useAppTheme();

  return (
    <AdaptiveGlassView
      interactive
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={icon} size={20} color={colors.text} />
    </AdaptiveGlassView>
  );
}

export function HomeTopBar({
  firstName,
  lastName,
  avatarUrl,
  workspaceLabel,
  workspaceRole,
  planName,
}: HomeTopBarProps) {
  const handleProfilePress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/(tabs)/(home)/profile" as never);
  };

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const subtitle = workspaceLabel ?? "Tu workspace activo";

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.md,
      }}
    >
      <Pressable
        onPress={handleProfilePress}
        hitSlop={10}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          flex: 1,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        })}
      >
        <UserAvatar size={52} name={fullName} uri={avatarUrl} />
        <View style={{ gap: 2, flexShrink: 1 }}>
          <Typography size={14} lineHeight={20} weight="medium" color="textMuted">
            Workspace activo
          </Typography>
          <Typography
            size={20}
            lineHeight={28}
            letterSpacing={-0.25}
            weight="bold"
            color="text"
            numberOfLines={1}
          >
            {fullName || "Usuario"}
          </Typography>
          <Typography
            size={14}
            lineHeight={20}
            color="textMuted"
            numberOfLines={1}
            selectable
          >
            {subtitle}
          </Typography>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
            {workspaceRole ? <ContextChip label={workspaceRole} /> : null}
            {planName ? <ContextChip label={planName} /> : null}
          </View>
        </View>
      </Pressable>

      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
        <HeaderAction icon="Bell" />
        <HeaderAction icon="CalendarBlank" />
      </View>
    </Animated.View>
  );
}
