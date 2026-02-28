import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { fonts, radius, spacing } from "@/constants/theme";
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
          fontSize: fonts.sizes.md,
          fontWeight: fonts.weights.semibold,
          color: colors.text,
        }}
      >
        {value}
      </Text>
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
      <Text
        style={{
          fontSize: fonts.sizes.xs,
          fontWeight: fonts.weights.semibold,
          color: config.text,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { data: user, isLoading, error, refetch } = useUser();
  const localUser = useAuthStore((s) => s.user);
  const logout = useLogout();

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
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fonts.sizes.md,
            textAlign: "center",
          }}
        >
          No pudimos cargar tu perfil.
        </Text>
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
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: fonts.sizes.md,
              fontWeight: fonts.weights.semibold,
            }}
          >
            Reintentar
          </Text>
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
          <Text
            style={{
              color: colors.textMuted,
              fontSize: fonts.sizes.sm,
              fontWeight: fonts.weights.semibold,
            }}
          >
            Volver a welcome
          </Text>
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
        padding: spacing.xl,
        gap: spacing.lg,
      }}
    >
      {/* Welcome header */}
      <Animated.View
        entering={FadeInDown.duration(200)}
        style={{ gap: spacing.xs }}
      >
        <Text
          style={{
            fontSize: fonts.sizes["3xl"],
            fontWeight: fonts.weights.bold,
            color: colors.text,
            letterSpacing: -0.5,
          }}
        >
          ¡Hola, {displayUser?.firstName}!
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
          <StatusBadge status={displayUser?.status ?? "ACTIVE"} />
          <Text
            style={{
              fontSize: fonts.sizes.sm,
              color: colors.textMuted,
              fontWeight: fonts.weights.medium,
            }}
          >
            Plan {displayUser?.plan.name}
          </Text>
        </View>
      </Animated.View>

      {/* Profile info cards */}
      <View style={{ gap: spacing.md }}>
        <Text
          style={{
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.semibold,
            color: colors.text,
          }}
        >
          Tu perfil
        </Text>

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
          <Text
            style={{
              color: "#EF4444",
              fontSize: fonts.sizes.md,
              fontWeight: fonts.weights.semibold,
            }}
          >
            {logout.isPending ? "Cerrando sesión..." : "Cerrar sesión"}
          </Text>
        </Pressable>
      </Animated.View>

      {/* Bottom padding for scroll */}
      <View style={{ height: spacing["2xl"] }} />
    </ScrollView>
  );
}
