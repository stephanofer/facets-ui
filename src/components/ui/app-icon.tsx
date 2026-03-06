import { MaterialIcons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";

import type { SymbolViewProps } from "expo-symbols";
import type { ComponentProps } from "react";
import type { StyleProp, ViewStyle } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];
type SFSymbolName = SymbolViewProps["name"];

interface AppIconProps {
  /** SF Symbol name for iOS */
  sf: SFSymbolName;
  /** Material Icon name for Android */
  material: MaterialIconName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}

export function AppIcon({
  sf,
  material,
  size = 24,
  color,
  style,
}: AppIconProps) {
  if (process.env.EXPO_OS === "ios") {
    return (
      <SymbolView
        name={sf}
        tintColor={color}
        resizeMode="scaleAspectFit"
        style={[{ width: size, height: size }, style]}
      />
    );
  }

  return <MaterialIcons name={material} size={size} color={color} />;
}
