import { NativeTabs } from "expo-router/unstable-native-tabs";

const Icon = NativeTabs.Trigger.Icon;
const Label = NativeTabs.Trigger.Label;

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(transactions)">
        <Icon sf="arrow.left.arrow.right" />
        <Label>Transactions</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(settings)">
        <Icon sf="gearshape.fill" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
