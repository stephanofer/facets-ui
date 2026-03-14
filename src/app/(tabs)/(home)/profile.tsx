import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AdaptiveGlassView } from "@/components/ui/adaptive-glass-view";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { UserAvatar } from "@/components/ui/user-avatar";
import { radius, spacing } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useUser } from "@/features/auth/hooks/use-user";
import { useAuthStore } from "@/stores/auth-store";

function ProfileInfoRow({ label, value }: { label: string; value: string }) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      style={{
        gap: spacing.xs,
        borderRadius: radius.lg,
        borderCurve: "continuous",
        padding: spacing.lg,
        backgroundColor: colors.card,
        borderWidth: isDark ? 1 : 0,
        borderColor: colors.border,
        boxShadow: isDark ? undefined : "0 10px 30px rgba(15, 23, 42, 0.06)",
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
        size={16}
        lineHeight={24}
        color="text"
        weight="bold"
        selectable
      >
        {value}
      </Typography>
    </View>
  );
}

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();
  const localUser = useAuthStore((s) => s.user);

  const displayUser = user ?? localUser;
  const fullName = [displayUser?.firstName, displayUser?.lastName]
    .filter(Boolean)
    .join(" ");

  const handleTapAvatar = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: spacing.xl,
        paddingTop:
          process.env.EXPO_OS === "android" ? insets.top + spacing.md : spacing.md,
        paddingBottom: insets.bottom + spacing["4xl"],
        gap: spacing.xl,
      }}
    >
      <Animated.View
        entering={FadeInDown.duration(220)}
        style={{ alignItems: "center", gap: spacing.lg }}
      >
        <Link href="/profile-avatar-sheet" asChild>
          <Pressable
            onPress={handleTapAvatar}
            style={({ pressed }) => ({
              alignItems: "center",
              justifyContent: "center",
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <View>
              <UserAvatar
                size={120}
                name={fullName}
                uri={displayUser?.avatar?.url ?? null}
              />
              <AdaptiveGlassView
                interactive
                style={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name="Camera"
                  weight="fill"
                  size={18}
                  color={colors.text}
                />
              </AdaptiveGlassView>
            </View>
          </Pressable>
        </Link>

        <View style={{ alignItems: "center", gap: spacing.xs }}>
          <Typography
            size={24}
            lineHeight={32}
            letterSpacing={-0.4}
            weight="bold"
            color="text"
            align="center"
          >
            {fullName || "Usuario"}
          </Typography>
          <Typography
            size={16}
            lineHeight={24}
            color="textMuted"
            selectable
            align="center"
          >
            {displayUser?.email ?? "—"}
          </Typography>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(220).delay(80)} style={{ gap: spacing.md }}>
        <ProfileInfoRow label="Plan" value={displayUser?.plan.name ?? "—"} />
        <ProfileInfoRow
          label="Estado"
          value={displayUser?.status === "ACTIVE" ? "Activa" : displayUser?.status ?? "—"}
        />
        <ProfileInfoRow label="Nombre" value={fullName || "—"} />
        <ProfileInfoRow label="Correo" value={displayUser?.email ?? "—"} />
      </Animated.View>
    </ScrollView>
  );
}
