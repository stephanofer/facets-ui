import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-white mb-4">
          Facets
        </Text>
        <Text className="text-lg text-slate-400 text-center">
          NativeWind is working! 🎉
        </Text>
        
        {/* Test different Tailwind utilities */}
        <View className="mt-8 w-full gap-4">
          <View className="bg-indigo-600 rounded-2xl p-4">
            <Text className="text-white font-semibold text-center">
              Primary Button Style
            </Text>
          </View>
          
          <View className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
            <Text className="text-slate-300 text-center">
              Card Style
            </Text>
          </View>
          
          <View className="flex-row justify-between">
            <View className="bg-green-500/20 rounded-xl px-4 py-2">
              <Text className="text-green-400 font-medium">Income</Text>
            </View>
            <View className="bg-red-500/20 rounded-xl px-4 py-2">
              <Text className="text-red-400 font-medium">Expense</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
