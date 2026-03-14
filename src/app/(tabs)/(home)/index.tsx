import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Typography } from "@/components/ui/typography";
import { radius, spacing } from "@/constants/theme";
import { HomeTopBar } from "@/features/auth/components/home-top-bar";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useCurrentSubscription } from "@/features/subscriptions/hooks/use-current-subscription";
import { useSubscriptionUsage } from "@/features/subscriptions/hooks/use-subscription-usage";
import { useCurrentWorkspace } from "@/features/workspaces/hooks/use-current-workspace";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ApiError } from "@/lib/api-client";
import { showSessionRecoveryToast } from "@/lib/toast";

import type { ReactNode } from "react";
import type { CurrentSubscription, UsageFeature } from "@/features/subscriptions/types";
import type { CurrentWorkspace } from "@/features/workspaces/types";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  try {
    return format(new Date(value), "d 'de' MMMM, yyyy", {
      locale: es,
    });
  } catch {
    return "-";
  }
}

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

function formatWorkspaceStatus(value?: string | null) {
  switch (value) {
    case "ACTIVE":
      return "Activo";
    case "SUSPENDED":
      return "Suspendido";
    default:
      return value ?? "-";
  }
}

function formatUserStatus(value?: string | null) {
  switch (value) {
    case "ACTIVE":
      return "Activa";
    case "PENDING_VERIFICATION":
      return "Pendiente de verificacion";
    case "SUSPENDED":
      return "Suspendida";
    case "DELETED":
      return "Eliminada";
    default:
      return value ?? "-";
  }
}

function formatSubscriptionStatus(value?: string | null) {
  switch (value) {
    case "ACTIVE":
      return "Activa";
    case "TRIALING":
      return "En prueba";
    case "CANCELED":
      return "Cancelada";
    default:
      return value ?? "-";
  }
}

function formatFeatureLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isRestrictedError(error: unknown) {
  return error instanceof ApiError && error.status === 403;
}

function isUnavailableError(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}

function getPlanGuidance({
  workspaceRole,
  hasReachedLimit,
  planName,
}: {
  workspaceRole?: string;
  hasReachedLimit: boolean;
  planName?: string;
}) {
  const normalizedRole = workspaceRole?.toUpperCase();

  if (!hasReachedLimit) {
    if (normalizedRole === "ADMIN") {
      return `Estas administrando el plan ${planName ?? "actual"} y podes revisar limites del workspace desde Home.`;
    }

    return `Estas viendo el plan ${planName ?? "actual"} con permisos ${formatRoleLabel(workspaceRole)} dentro del workspace.`;
  }

  if (normalizedRole === "ADMIN") {
    return "Ya llegaste al limite en al menos una capacidad. Toca revisar el plan o ajustar el uso del workspace.";
  }

  return "Hay limites alcanzados. Necesitas que un admin cambie el plan o ajuste limites.";
}

function HomeCard({
  title,
  subtitle,
  delay = 0,
  children,
}: {
  title: string;
  subtitle?: string;
  delay?: number;
  children: ReactNode;
}) {
  const { colors, isDark } = useAppTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(delay)}
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderCurve: "continuous",
        padding: spacing.lg,
        gap: spacing.md,
        boxShadow: isDark ? undefined : "0 10px 30px rgba(15, 23, 42, 0.06)",
        borderWidth: isDark ? 1 : 0,
        borderColor: colors.border,
      }}
    >
      <View style={{ gap: spacing.xs }}>
        <Typography size={18} lineHeight={26} weight="bold" color="text">
          {title}
        </Typography>
        {subtitle ? (
          <Typography size={14} lineHeight={20} color="textMuted">
            {subtitle}
          </Typography>
        ) : null}
      </View>
      {children}
    </Animated.View>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: spacing.md,
      }}
    >
      <Typography size={14} lineHeight={20} color="textMuted" style={{ flex: 1 }}>
        {label}
      </Typography>
      <Typography
        size={14}
        lineHeight={20}
        weight="medium"
        color="text"
        align="right"
        selectable
        style={{ flex: 1, color: colors.text }}
      >
        {value}
      </Typography>
    </View>
  );
}

function SectionStateCard({
  title,
  message,
  tone,
  delay = 0,
}: {
  title: string;
  message: string;
  tone: "restricted" | "unavailable";
  delay?: number;
}) {
  const { semantic } = useAppTheme();
  const accent = tone === "restricted" ? semantic.warning : semantic.info;
  const background = tone === "restricted" ? semantic.warningSoft : semantic.infoSoft;

  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(delay)}
      style={{
        borderRadius: radius.lg,
        borderCurve: "continuous",
        padding: spacing.lg,
        gap: spacing.xs,
        backgroundColor: background,
      }}
    >
      <Typography size={16} lineHeight={24} weight="bold" color={accent}>
        {title}
      </Typography>
      <Typography size={14} lineHeight={20} color="text">
        {message}
      </Typography>
    </Animated.View>
  );
}

function ProgressBar({ percentage }: { percentage: number }) {
  const { colors, semantic } = useAppTheme();
  const clamped = Math.max(0, Math.min(percentage, 100));
  const fillColor = clamped >= 100 ? semantic.warning : colors.primary;

  return (
    <View
      style={{
        height: 8,
        borderRadius: radius.pill,
        overflow: "hidden",
        backgroundColor: "rgba(148, 163, 184, 0.18)",
      }}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: "100%",
          backgroundColor: fillColor,
        }}
      />
    </View>
  );
}

function UsageFeatureCard({ feature }: { feature: UsageFeature }) {
  const { semantic } = useAppTheme();
  const limitLabel = feature.limit === null ? "Sin limite" : `${feature.current}/${feature.limit}`;

  return (
    <View
      style={{
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: radius.md,
        borderCurve: "continuous",
        backgroundColor: feature.limitReached ? semantic.warningSoft : "rgba(148, 163, 184, 0.08)",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: spacing.md,
          alignItems: "center",
        }}
      >
        <Typography size={14} lineHeight={20} weight="bold" color="text" style={{ flex: 1 }}>
          {formatFeatureLabel(feature.featureCode)}
        </Typography>
        <Typography size={12} lineHeight={16} color="textMuted" numeric="tabular">
          {Math.round(feature.usagePercentage)}%
        </Typography>
      </View>
      <ProgressBar percentage={feature.usagePercentage} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: spacing.md,
        }}
      >
        <Typography size={13} lineHeight={18} color="textMuted">
          {limitLabel}
        </Typography>
        <Typography
          size={13}
          lineHeight={18}
          color={feature.limitReached ? semantic.warning : "textMuted"}
          weight="medium"
        >
          {feature.limitReached ? "Limite alcanzado" : "Disponible"}
        </Typography>
      </View>
    </View>
  );
}

function SessionSummarySection({
  session,
  joinedAt,
}: {
  session: NonNullable<ReturnType<typeof useAuthSession>["data"]>;
  joinedAt: string;
}) {
  return (
    <HomeCard title="Resumen de sesion" subtitle="Tu identidad y contexto de acceso activos." delay={40}>
      <DataRow
        label="Nombre"
        value={[session.user.firstName, session.user.lastName].filter(Boolean).join(" ") || "-"}
      />
      <DataRow label="Email" value={session.user.email} />
      <DataRow
        label="Verificacion"
        value={session.user.emailVerified ? "Email verificado" : "Pendiente de verificacion"}
      />
      <DataRow label="Rol plataforma" value={formatRoleLabel(session.platformRole)} />
      <DataRow label="Rol workspace" value={formatRoleLabel(session.workspaceRole)} />
      <DataRow label="Estado usuario" value={formatUserStatus(session.user.status)} />
      <DataRow label="Estado membresia" value={formatWorkspaceStatus(session.membership.status)} />
      <DataRow label="Miembro desde" value={joinedAt} />
    </HomeCard>
  );
}

function WorkspaceSection({
  workspaceData,
}: {
  workspaceData: CurrentWorkspace;
}) {
  return (
    <HomeCard
      title="Workspace activo"
      subtitle="El tenant real del producto ahora vive aca, no en el usuario suelto."
      delay={80}
    >
      <DataRow label="Etiqueta compartida" value={workspaceData.settings.displayLabel} />
      <DataRow label="Nombre" value={workspaceData.workspace.name} />
      <DataRow label="Tipo" value={formatWorkspaceType(workspaceData.workspace.type)} />
      <DataRow label="Estado" value={formatWorkspaceStatus(workspaceData.workspace.status)} />
      <DataRow label="Zona horaria" value={workspaceData.settings.timezone} />
      <DataRow label="Creado" value={formatDate(workspaceData.workspace.createdAt)} />
      <DataRow label="Ingreso al workspace" value={formatDate(workspaceData.membership.joinedAt)} />
    </HomeCard>
  );
}

function SettingsSection({
  settings,
}: {
  settings: CurrentWorkspace["settings"];
}) {
  return (
    <HomeCard
      title="Configuracion compartida"
      subtitle="Preferencias del workspace que afectan como ves y cargas informacion."
      delay={120}
    >
      <DataRow label="Locale" value={settings.locale} />
      <DataRow label="Idioma base" value={settings.baseLanguage} />
      <DataRow label="Moneda base" value={settings.baseCurrencyCode} />
      <DataRow label="Formato de fecha" value={settings.dateFormat} />
      <DataRow label="Inicio de semana" value={String(settings.weekStartDay)} />
      <DataRow label="Inicio de mes" value={String(settings.monthStartDay)} />
    </HomeCard>
  );
}

function SubscriptionSection({
  subscriptionData,
  workspaceRole,
}: {
  subscriptionData: CurrentSubscription;
  workspaceRole?: string;
}) {
  const isAdmin = workspaceRole?.toUpperCase() === "ADMIN";
  const plan = subscriptionData.subscription.plan;
  const priceValue = plan.priceMonthly ?? plan.priceYearly;
  const priceLabel =
    priceValue === undefined || priceValue === null
      ? "Sin precio publicado"
      : `${plan.priceCurrency ?? "USD"} ${priceValue}${plan.priceMonthly != null ? "/mes" : "/anio"}`;

  return (
    <HomeCard
      title="Plan y suscripcion"
      subtitle={
        isAdmin
          ? "Tenes visibilidad del plan activo y de lo que hoy sostiene al workspace."
          : "Ves el plan activo, pero la gestion de billing sigue reservada para admins."
      }
      delay={160}
    >
      <DataRow label="Plan" value={`${plan.name} (${plan.code})`} />
      <DataRow label="Estado" value={formatSubscriptionStatus(subscriptionData.subscription.status)} />
      <DataRow label="Precio" value={priceLabel} />
      <DataRow label="Periodo actual" value={formatDate(subscriptionData.subscription.currentPeriodStart)} />
      <DataRow label="Fin de periodo" value={formatDate(subscriptionData.subscription.currentPeriodEnd)} />
      <DataRow label="Capacidades del plan" value={String(plan.features.length)} />
      <Typography size={14} lineHeight={20} color="textMuted">
        {isAdmin
          ? "No mostramos flujos de upgrade aca todavia, pero si el contexto necesario para decidir que hacer."
          : "Si necesitas cambiar el plan o ajustar billing, pediselo a un admin del workspace."}
      </Typography>
    </HomeCard>
  );
}

function UsageSection({
  features,
  workspaceRole,
  planName,
}: {
  features: UsageFeature[];
  workspaceRole?: string;
  planName?: string;
}) {
  const sortedFeatures = [...features].sort(
    (left, right) => Number(right.limitReached) - Number(left.limitReached) || right.usagePercentage - left.usagePercentage,
  );
  const hasReachedLimit = sortedFeatures.some((feature) => feature.limitReached);

  return (
    <HomeCard
      title="Uso y limites"
      subtitle={getPlanGuidance({ workspaceRole, hasReachedLimit, planName })}
      delay={200}
    >
      {sortedFeatures.length === 0 ? (
        <Typography size={14} lineHeight={20} color="textMuted">
          Todavia no hay metricas de uso para mostrar en este workspace.
        </Typography>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {sortedFeatures.map((feature) => (
            <UsageFeatureCard key={feature.featureCode} feature={feature} />
          ))}
        </View>
      )}
    </HomeCard>
  );
}

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { data: session, isLoading, error, refetch } = useAuthSession();
  const lastRecoveryErrorRef = useRef<unknown>(null);
  const workspaceQuery = useCurrentWorkspace();
  const subscriptionQuery = useCurrentSubscription();
  const usageQuery = useSubscriptionUsage();
  const logout = useLogout();
  const { hasShareIntent } = useShareIntentContext();

  useEffect(() => {
    if (hasShareIntent) {
      router.push("/(tabs)/(home)/share-intent-debug" as never);
    }
  }, [hasShareIntent]);

  useEffect(() => {
    if (!error || session) {
      lastRecoveryErrorRef.current = null;
      return;
    }

    if (lastRecoveryErrorRef.current === error) {
      return;
    }

    lastRecoveryErrorRef.current = error;
    showSessionRecoveryToast(
      error instanceof ApiError ? error.message : undefined,
    );
  }, [error, session]);

  const handleLogout = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    logout.mutate();
  };

  if (isLoading && !session) {
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

  if (error && !session) {
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
        <Typography size={18} lineHeight={26} weight="bold" align="center">
          Reintenta recuperar tu espacio
        </Typography>
        <Typography size={15} lineHeight={22} color="textMuted" align="center">
          Tu sesion remota puede seguir activa, pero necesitamos volver a cargarla antes de mostrar Home.
        </Typography>
        <Pressable
          onPress={() => refetch()}
          style={({ pressed }) => ({
            backgroundColor: pressed ? `${colors.primary}DD` : colors.primary,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            borderCurve: "continuous",
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Typography size={16} lineHeight={24} color="#FFFFFF" weight="bold">
            Reintentar
          </Typography>
        </Pressable>
      </ScrollView>
    );
  }

  if (!session) {
    return null;
  }

  const workspaceData = workspaceQuery.data;
  const settingsData = workspaceData?.settings;
  const subscriptionData = subscriptionQuery.data;
  const usageData = usageQuery.data;
  const joinedAt = formatDate(session.membership.joinedAt ?? session.user.createdAt);

  const workspaceLabel = workspaceData?.settings.displayLabel ?? settingsData?.displayLabel ?? session.workspace.name;
  const usageFeatures = usageData?.features ?? [];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: spacing.xl,
        paddingTop: process.env.EXPO_OS === "android" ? insets.top + spacing.md : spacing.md,
        paddingBottom: insets.bottom + spacing["4xl"],
        gap: spacing.lg,
      }}
    >
      <HomeTopBar
        firstName={session.user.firstName}
        lastName={session.user.lastName}
        avatarUrl={session.user.avatar?.url ?? null}
        workspaceLabel={workspaceLabel}
        workspaceRole={formatRoleLabel(session.workspaceRole)}
        planName={session.plan.name}
      />

      <SessionSummarySection session={session} joinedAt={joinedAt} />

      {workspaceData ? <WorkspaceSection workspaceData={workspaceData} /> : null}
      {workspaceQuery.error && isRestrictedError(workspaceQuery.error) ? (
        <SectionStateCard
          title="Workspace restringido"
          message="Tu sesion sigue activa, pero este workspace no te deja ver todos los detalles compartidos ahora mismo."
          tone="restricted"
          delay={80}
        />
      ) : null}
      {workspaceQuery.error && isUnavailableError(workspaceQuery.error) ? (
        <SectionStateCard
          title="Workspace no disponible"
          message="No encontramos el resumen del workspace activo. El resto de Home sigue disponible mientras recuperamos ese contexto."
          tone="unavailable"
          delay={80}
        />
      ) : null}

      {settingsData ? <SettingsSection settings={settingsData} /> : null}
      {!settingsData && workspaceQuery.error && isRestrictedError(workspaceQuery.error) ? (
        <SectionStateCard
          title="Configuracion restringida"
          message="Podes seguir usando Home, pero no tenes permisos para ver toda la configuracion compartida del workspace."
          tone="restricted"
          delay={120}
        />
      ) : null}
      {!settingsData && workspaceQuery.error && isUnavailableError(workspaceQuery.error) ? (
        <SectionStateCard
          title="Configuracion no disponible"
          message="La configuracion compartida del workspace no esta disponible en este momento."
          tone="unavailable"
          delay={120}
        />
      ) : null}

      {subscriptionData ? (
        <SubscriptionSection
          subscriptionData={subscriptionData}
          workspaceRole={session.workspaceRole}
        />
      ) : null}
      {subscriptionQuery.error && isRestrictedError(subscriptionQuery.error) ? (
        <SectionStateCard
          title="Billing restringido"
          message="Ves tu sesion y el workspace, pero el detalle del plan queda reservado para quien administra billing."
          tone="restricted"
          delay={160}
        />
      ) : null}
      {subscriptionQuery.error && isUnavailableError(subscriptionQuery.error) ? (
        <SectionStateCard
          title="Suscripcion no disponible"
          message="No pudimos leer el plan actual del workspace. El resto de la Home sigue funcionando."
          tone="unavailable"
          delay={160}
        />
      ) : null}

      {usageData ? (
        <UsageSection
          features={usageFeatures}
          workspaceRole={session.workspaceRole}
          planName={usageData.planName}
        />
      ) : null}
      {usageQuery.error && isRestrictedError(usageQuery.error) ? (
        <SectionStateCard
          title="Uso restringido"
          message={
            session.workspaceRole.toUpperCase() === "ADMIN"
              ? "Tu rol admin sigue activo, pero esta metrica esta restringida por permisos del backend en este momento."
              : "Necesitas que un admin cambie el plan o ajuste limites para desbloquear mas detalle de uso."
          }
          tone="restricted"
          delay={200}
        />
      ) : null}
      {usageQuery.error && isUnavailableError(usageQuery.error) ? (
        <SectionStateCard
          title="Uso no disponible"
          message="No hay metricas de uso disponibles para este workspace ahora mismo."
          tone="unavailable"
          delay={200}
        />
      ) : null}

      <Animated.View entering={FadeInDown.duration(200).delay(240)}>
        <Pressable
          onPress={handleLogout}
          disabled={logout.isPending}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "rgba(239, 68, 68, 0.12)" : "transparent",
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
          <Typography size={16} lineHeight={24} color="#EF4444" weight="bold">
            {logout.isPending ? "Cerrando sesion..." : "Cerrar sesion"}
          </Typography>
        </Pressable>
      </Animated.View>

      <View style={{ height: spacing.xs }} />
    </ScrollView>
  );
}
