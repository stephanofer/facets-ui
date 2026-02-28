import { Text, View } from "react-native";

import { useAppTheme } from "@/hooks/use-app-theme";

export default function HomeScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: colors.text, fontSize: 18 }}>Home</Text>
    </View>
  );
}
