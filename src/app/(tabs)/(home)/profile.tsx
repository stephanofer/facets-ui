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
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useCurrentSubscription } from "@/features/subscriptions/hooks/use-current-subscription";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/use-current-workspace";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ApiError } from "@/lib/api-client";

function formatRoleLabel(value?: string | null) {
  if (!value) {
    return "-";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function formatWorkspaceType(value?: string | null) {
  switch (value) {
    case "PERSONAL":
      return "Personal";
    case "TEAM":
      return "Equipo";
    default:
      return value ?? "-";
  }
}

function formatStatusLabel(value?: string | null) {
  switch (value) {
    case "ACTIVE":
      return "Activo";
    case "SUSPENDED":
      return "Suspendido";
    case "PENDING_VERIFICATION":
      return "Pendiente de verificacion";
    default:
      return value ?? "-";
  }
}

function isRestrictedError(error: unknown) {
  return error instanceof ApiError && error.status === 403;
}

function isUnavailableError(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}

function ProfileInfoRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "muted";
}) {
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
        color={tone === "muted" ? "textMuted" : "text"}
        weight="bold"
        selectable
      >
        {value}
      </Typography>
    </View>
  );
}

export default function ProfileScreen() {
  const { colors, semantic } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { data: session } = useAuthSession();
  const workspaceQuery = useCurrentWorkspace();
  const subscriptionQuery = useCurrentSubscription();

  const displayUser = session?.user;
  const fullName = [displayUser?.firstName, displayUser?.lastName]
    .filter(Boolean)
    .join(" ");
  const workspaceName = workspaceQuery.data?.workspace.name ?? session?.workspace.name ?? "-";
  const workspaceType = workspaceQuery.data?.workspace.type ?? session?.workspace.type;
  const planName = subscriptionQuery.data?.subscription.plan.name ?? session?.plan.name ?? "-";

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
        paddingTop: process.env.EXPO_OS === "android" ? insets.top + spacing.md : spacing.md,
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
            {displayUser?.email ?? "-"}
          </Typography>
          <Typography size={14} lineHeight={20} color="textMuted" align="center">
            {workspaceName}
          </Typography>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(220).delay(80)} style={{ gap: spacing.md }}>
        <ProfileInfoRow label="Plan" value={planName} />
        <ProfileInfoRow label="Rol plataforma" value={formatRoleLabel(session?.platformRole)} />
        <ProfileInfoRow label="Rol workspace" value={formatRoleLabel(session?.workspaceRole)} />
        <ProfileInfoRow label="Workspace" value={workspaceName} />
        <ProfileInfoRow label="Tipo de workspace" value={formatWorkspaceType(workspaceType)} />
        <ProfileInfoRow label="Estado usuario" value={formatStatusLabel(displayUser?.status)} />
        <ProfileInfoRow label="Estado membresia" value={formatStatusLabel(session?.membership.status)} />
      </Animated.View>

      {workspaceQuery.error && isRestrictedError(workspaceQuery.error) ? (
        <View
          style={{
            padding: spacing.lg,
            borderRadius: radius.lg,
            borderCurve: "continuous",
            backgroundColor: semantic.warningSoft,
            gap: spacing.xs,
          }}
        >
          <Typography size={16} lineHeight={24} weight="bold" color={semantic.warning}>
            Perfil restringido por workspace
          </Typography>
          <Typography size={14} lineHeight={20} color="text">
            Tu sesion sigue bien, pero algunos datos compartidos del workspace no estan disponibles para tu rol actual.
          </Typography>
        </View>
      ) : null}

      {workspaceQuery.error && isUnavailableError(workspaceQuery.error) ? (
        <ProfileInfoRow
          label="Workspace"
          value="El detalle del workspace no esta disponible en este momento."
          tone="muted"
        />
      ) : null}

      {subscriptionQuery.error && isRestrictedError(subscriptionQuery.error) ? (
        <ProfileInfoRow
          label="Billing"
          value="El detalle de billing y gestion del plan queda reservado para admins del workspace."
          tone="muted"
        />
      ) : null}
    </ScrollView>
  );
}
