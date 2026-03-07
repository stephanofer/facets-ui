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

export function HomeTopBar({ firstName, lastName, avatarUrl }: HomeTopBarProps) {
  const { colors } = useAppTheme();

  const handleProfilePress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/(tabs)/(home)/profile" as never);
  };

  const fullName = [firstName, lastName].filter(Boolean).join(" ");

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
          <Typography variant="label" color="textMuted">
            Bienvenido nuevamente
          </Typography>
          <Typography
            variant="h3"
            color="text"
            numberOfLines={1}
            style={{ letterSpacing: -0.3 }}
          >
            {fullName || "Usuario"}
          </Typography>
        </View>
      </Pressable>

      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
        <HeaderAction icon="Bell" />
        <HeaderAction icon="CalendarBlank" />
      </View>
    </Animated.View>
  );
}
