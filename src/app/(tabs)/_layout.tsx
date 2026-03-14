import { NativeTabs } from "expo-router/unstable-native-tabs";

import { colors, typography } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

export default function TabsLayout() {
  const { isDark } = useAppTheme();

  return (
    <NativeTabs
      backgroundColor={isDark ? colors.dark.card : colors.light.card}
      tintColor={isDark ? colors.dark.primary : colors.light.primary}
      labelStyle={typography.native.tabLabel}
      iconColor={{
        default: isDark ? colors.dark.textMuted : colors.light.textMuted,
        selected: isDark ? colors.dark.primary : colors.light.primary,
      }}
      blurEffect="systemChromeMaterial"
      shadowColor="rgba(15, 23, 42, 0.08)"
      minimizeBehavior="onScrollDown"
      labelVisibilityMode="labeled"
      disableIndicator={false}
      rippleColor="rgba(13, 148, 136, 0.12)"
    >
      <NativeTabs.Trigger name="(home)" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md="home"
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(transactions)" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Icon
          sf={{ default: "arrow.left.arrow.right", selected: "arrow.left.arrow.right.circle.fill" }}
          md="swap_horiz"
        />
        <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(goals)" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Icon
          sf={{ default: "flag", selected: "flag.fill" }}
          md="flag"
        />
        <NativeTabs.Trigger.Label>Goals</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)" disableTransparentOnScrollEdge>
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
