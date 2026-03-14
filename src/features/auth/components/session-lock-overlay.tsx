import { View } from "react-native";

import { PrimaryButton } from "@/components/ui/primary-button";
import { Typography } from "@/components/ui/typography";
import { radius, spacing } from "@/constants/theme";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useLocalAuthStore } from "@/stores/local-auth-store";

interface SessionLockOverlayProps {
  onRetry: () => Promise<boolean>;
}

export function SessionLockOverlay({ onRetry }: SessionLockOverlayProps) {
  const { colors, isDark } = useAppTheme();
  const logout = useLogout();
  const isLocked = useLocalAuthStore((s) => s.isLocked);
  const isPromptInFlight = useLocalAuthStore((s) => s.isPromptInFlight);
  const requiresManualRetry = useLocalAuthStore((s) => s.requiresManualRetry);

  if (!isLocked) {
    return null;
  }

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        padding: spacing.xl,
        justifyContent: "center",
        backgroundColor: isDark
          ? "rgba(0, 0, 0, 0.72)"
          : "rgba(248, 250, 251, 0.92)",
        zIndex: 50,
      }}
    >
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: radius.xl,
          borderCurve: "continuous",
          padding: spacing.xl,
          gap: spacing.lg,
          borderWidth: isDark ? 1 : 0,
          borderColor: colors.border,
          boxShadow: isDark ? undefined : "0 20px 60px rgba(15, 23, 42, 0.14)",
        }}
      >
        <View style={{ gap: spacing.sm }}>
          <Typography size={24} lineHeight={30} weight="bold">
            {isPromptInFlight ? "Verificando identidad" : "Espacio bloqueado"}
          </Typography>
          <Typography size={15} lineHeight={22} color="textMuted">
            {requiresManualRetry
              ? "Tu sesion sigue activa, pero Facets queda bloqueado hasta que reintentes o cierres sesion."
              : "Despues de un rato sin actividad, te pedimos validar que seguis siendo vos antes de mostrar el shell autenticado."}
          </Typography>
        </View>

        <View style={{ gap: spacing.md }}>
          <PrimaryButton
            title={isPromptInFlight ? "Validando..." : "Reintentar desbloqueo"}
            onPress={() => {
              void onRetry();
            }}
            loading={isPromptInFlight}
            disabled={logout.isPending}
          />
          <PrimaryButton
            title={logout.isPending ? "Cerrando sesion..." : "Cerrar sesion"}
            onPress={() => {
              logout.mutate();
            }}
            loading={logout.isPending}
            disabled={isPromptInFlight}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}
