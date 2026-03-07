import { BellIcon } from "phosphor-react-native";
import { CalendarBlankIcon } from "phosphor-react-native";
import { CameraIcon } from "phosphor-react-native";
import { CaretLeftIcon } from "phosphor-react-native";
import { EyeIcon } from "phosphor-react-native";
import { EyeSlashIcon } from "phosphor-react-native";
import { ImageIcon } from "phosphor-react-native";
import { TrashIcon } from "phosphor-react-native";
import { XIcon } from "phosphor-react-native";

import { useAppTheme } from "@/hooks/use-app-theme";

import type { IconWeight } from "phosphor-react-native";
import type { StyleProp, ViewStyle } from "react-native";

// ---------------------------------------------------------------------------
// Icon Registry
// ---------------------------------------------------------------------------
// Add new icons here: one import above + one entry below. That's it.
// Only registered icons are bundled — keeps the app lean.
// ---------------------------------------------------------------------------

const iconRegistry = {
  Bell: BellIcon,
  CalendarBlank: CalendarBlankIcon,
  Camera: CameraIcon,
  CaretLeft: CaretLeftIcon,
  Eye: EyeIcon,
  EyeSlash: EyeSlashIcon,
  Image: ImageIcon,
  Trash: TrashIcon,
  X: XIcon,
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type IconName = keyof typeof iconRegistry;

interface IconProps {
  /** Phosphor icon name — must be registered in the icon registry */
  name: IconName;
  /** Icon size in pixels @default 24 */
  size?: number;
  /** Phosphor weight variant @default "regular" */
  weight?: IconWeight;
  /** Colour override — defaults to theme `text` colour */
  color?: string;
  /** Optional style for the wrapping SVG view */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Icon({
  name,
  size = 24,
  weight = "regular",
  color,
  style,
}: IconProps) {
  const { colors } = useAppTheme();
  const IconComponent = iconRegistry[name];

  return (
    <IconComponent
      size={size}
      weight={weight}
      color={color ?? colors.text}
      style={style}
    />
  );
}

export type { IconName, IconProps, IconWeight };
