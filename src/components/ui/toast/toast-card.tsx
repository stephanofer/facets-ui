import { Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import {
  toastVariantMeta,
  type ToastRecord,
} from "@/components/ui/toast/toast-types";
import { Typography } from "@/components/ui/typography";
import { radius, spacing } from "@/constants/theme";

interface ToastCardProps {
  toast: ToastRecord;
  onDismiss: () => void;
}

export function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const meta = toastVariantMeta[toast.variant];
  const hasTitle = Boolean(toast.title);
  const hasMessage = Boolean(toast.message);
  const resolvedTitle = toast.title ?? meta.title;

  return (
    <View
      style={{
        width: "100%",
        maxWidth: 520,
        alignSelf: "center",
        paddingTop: hasTitle ? 28 : 0,
      }}
    >
      {hasTitle ? (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            top: 0,
            left: 24,
            right: 24,
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <View
            style={{
              minHeight: 56,
              maxWidth: "100%",
              borderRadius: radius.pill,
              borderCurve: "continuous",
              backgroundColor: "rgba(18, 18, 20, 0.98)",
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.08)",
              paddingLeft: spacing.sm,
              paddingRight: spacing.lg,
              paddingVertical: spacing.sm,
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
              boxShadow: `0 20px 38px ${meta.accentSoft}`,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: meta.accentSoft,
              }}
            >
              <Icon name={toast.iconName} size={20} color={meta.accentColor} weight="bold" />
            </View>

            <Typography
              size={18}
              lineHeight={22}
              weight="bold"
              color={meta.accentColor}
              style={{ flexShrink: 1 }}
            >
              {resolvedTitle}
            </Typography>
          </View>
        </View>
      ) : null}

      <View
        style={{
          backgroundColor: "rgba(18, 18, 20, 0.98)",
          borderRadius: 32,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.08)",
          paddingTop: hasTitle ? 36 : 18,
          paddingBottom: 18,
          paddingHorizontal: 22,
          gap: spacing.sm,
          minHeight: hasTitle && hasMessage ? 108 : 76,
          boxShadow: `0 24px 50px rgba(0, 0, 0, 0.28)`,
        }}
      >
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          {!hasTitle ? (
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: meta.accentSoft,
                marginTop: 2,
              }}
            >
              <Icon name={toast.iconName} size={22} color={meta.accentColor} weight="bold" />
            </View>
          ) : null}

          <View style={{ flex: 1, gap: hasTitle ? spacing.xs : spacing.sm }}>
            {!hasTitle ? (
              <Typography size={17} lineHeight={22} weight="bold" color={meta.accentColor}>
                {resolvedTitle}
              </Typography>
            ) : null}

            {hasMessage ? (
              <Typography
                size={15}
                lineHeight={22}
                weight="medium"
                color="rgba(255, 255, 255, 0.66)"
                style={{ flexShrink: 1 }}
              >
                {toast.message}
              </Typography>
            ) : null}
          </View>

          {toast.dismissible ? (
            <Pressable
              onPress={onDismiss}
              hitSlop={10}
              style={({ pressed }) => ({
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: pressed
                  ? "rgba(255, 255, 255, 0.08)"
                  : "transparent",
              })}
            >
              <Icon name="X" size={16} color="rgba(255, 255, 255, 0.72)" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
