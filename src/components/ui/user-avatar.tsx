import { Image } from "expo-image";
import { Text, View } from "react-native";

import { fonts } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";

interface UserAvatarProps {
  size: number;
  name?: string | null;
  uri?: string | null;
}

export function UserAvatar({ size, name, uri }: UserAvatarProps) {
  const { colors, isDark } = useAppTheme();

  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  if (uri) {
    return (
      <Image
        source={{ uri }}
        contentFit="cover"
        transition={180}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.card,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(13,148,136,0.12)",
        borderWidth: 1,
        borderColor: colors.border,
        borderCurve: "continuous",
      }}
    >
      <Text
        style={{
          fontSize: size * 0.34,
          fontWeight: fonts.weights.bold,
          color: colors.text,
        }}
      >
        {initials || "U"}
      </Text>
    </View>
  );
}
