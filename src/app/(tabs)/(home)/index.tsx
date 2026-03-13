import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/typography";
import { radius, spacing } from "@/constants/theme";
import { HomeTopBar } from "@/features/auth/components/home-top-bar";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useUser } from "@/features/auth/hooks/use-user";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuthStore } from "@/stores/auth-store";

function ProfileCard({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
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
        boxShadow: isDark
          ? undefined
          : "0 1px 3px rgba(0, 0, 0, 0.06)",
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : "transparent",
      }}
    >
      <Typography
        variant="small"
        color="textMuted"
        style={{ textTransform: "uppercase", letterSpacing: 0.5 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body"
        color="text"
        weight="bold"
        selectable
      >
        {value}
      </Typography>
    </Animated.View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    ACTIVE: { label: "Activa", bg: "rgba(34, 197, 94, 0.12)", text: "#22C55E" },
    PENDING_VERIFICATION: { label: "Pendiente", bg: "rgba(245, 158, 11, 0.12)", text: "#F59E0B" },
    SUSPENDED: { label: "Suspendida", bg: "rgba(239, 68, 68, 0.12)", text: "#EF4444" },
    DELETED: { label: "Eliminada", bg: "rgba(239, 68, 68, 0.12)", text: "#EF4444" },
  };

  const config = statusConfig[status] ?? statusConfig.ACTIVE;

  return (
    <View
      style={{
        backgroundColor: config.bg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.pill,
        alignSelf: "flex-start",
      }}
    >
      <Typography variant="small" color={config.text} weight="bold">
        {config.label}
      </Typography>
    </View>
  );
}

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { data: user, isLoading, error, refetch } = useUser();
  const localUser = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { hasShareIntent } = useShareIntentContext();

  // Navigate to share intent debug screen when content is shared
  useEffect(() => {
    if (hasShareIntent) {
      router.push("/(tabs)/(home)/share-intent-debug" as never);
    }
  }, [hasShareIntent]);

  // Use local cached user while query loads
  const displayUser = user ?? localUser;

  const handleLogout = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    logout.mutate();
  };

  if (isLoading && !displayUser) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </ScrollView>
    );
  }

  if (error && !displayUser) {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: spacing.xl,
          gap: spacing.lg,
        }}
      >
        <Typography variant="body" color="textMuted" align="center">
          No pudimos cargar tu perfil.
        </Typography>
        <Pressable
          onPress={() => refetch()}
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.primary + "DD" : colors.primary,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            borderCurve: "continuous",
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Typography variant="bodyMedium" color="#FFFFFF" weight="bold">
            Reintentar
          </Typography>
        </Pressable>
        <Pressable
          onPress={() => router.replace("/(auth)/welcome" as never)}
          style={({ pressed }) => ({
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            borderCurve: "continuous",
            transform: [{ scale: pressed ? 0.97 : 1 }],
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Typography variant="label" color="textMuted" weight="bold">
            Volver al acceso
          </Typography>
        </Pressable>
      </ScrollView>
    );
  }

  const createdAt = displayUser?.createdAt
    ? format(new Date(displayUser.createdAt), "d 'de' MMMM, yyyy", {
        locale: es,
      })
    : "—";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: spacing.xl,
        paddingTop:
          process.env.EXPO_OS === "android" ? insets.top + spacing.md : spacing.md,
        paddingBottom: insets.bottom + spacing["4xl"],
        gap: spacing.lg,
      }}
    >
      <HomeTopBar
        firstName={displayUser?.firstName}
        lastName={displayUser?.lastName}
        avatarUrl={displayUser?.avatar?.url ?? null}
      />

      <Animated.View entering={FadeInDown.duration(200).delay(40)} style={{ gap: spacing.xs }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
          <StatusBadge status={displayUser?.status ?? "ACTIVE"} />
          <Typography variant="label" color="textMuted">
            Plan {displayUser?.plan.name}
          </Typography>
        </View>
      </Animated.View>

      {/* Profile info cards */}
      <View style={{ gap: spacing.md }}>
        <Typography variant="subtitle" color="text" weight="bold">
          Tu perfil
        </Typography>

        <ProfileCard label="Nombre completo" value={`${displayUser?.firstName} ${displayUser?.lastName}`} delay={50} />
        <ProfileCard label="Email" value={displayUser?.email ?? "—"} delay={100} />
        <ProfileCard label="Email verificado" value={displayUser?.emailVerified ? "Sí ✓" : "No"} delay={150} />
        <ProfileCard label="Plan actual" value={`${displayUser?.plan.name} (${displayUser?.plan.code})`} delay={200} />
        <ProfileCard label="Miembro desde" value={createdAt} delay={250} />
        <ProfileCard label="ID de usuario" value={displayUser?.id ?? "—"} delay={300} />
      </View>

      {/* Logout button */}
      <Animated.View entering={FadeInDown.duration(200).delay(350)}>
        <Pressable
          onPress={handleLogout}
          disabled={logout.isPending}
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? "rgba(239, 68, 68, 0.12)"
              : "transparent",
            height: 52,
            borderRadius: radius.lg,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1.5,
            borderColor: "rgba(239, 68, 68, 0.3)",
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Typography variant="bodyMedium" color="#EF4444" weight="bold">
            {logout.isPending ? "Cerrando sesión..." : "Cerrar sesión"}
          </Typography>
        </Pressable>
      </Animated.View>

      <View style={{ height: spacing.xs }} />
    </ScrollView>
  );
}
