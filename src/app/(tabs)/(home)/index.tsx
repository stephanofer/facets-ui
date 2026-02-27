import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { z } from "zod";

import { fonts, radius, spacing, colors as themeColorTokens } from "@/constants/theme";
import { useAppTheme } from "@/hooks/use-app-theme";
import { apiClient } from "@/lib/api-client";
import { storage } from "@/lib/storage";
import { useUIStore } from "@/stores/ui-store";

const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

type Post = z.infer<typeof postSchema>;

async function fetchPosts(): Promise<Post[]> {
  const raw = await apiClient<unknown[]>("/posts?_limit=3");
  return raw.map((item) => postSchema.parse(item));
}

const LIBRARIES = [
  { name: "TanStack Query", version: "v5" },
  { name: "Zustand", version: "v5" },
  { name: "Zod", version: "v4" },
  { name: "React Hook Form", version: "" },
  { name: "Reanimated", version: "v4" },
  { name: "MMKV", version: "" },
  { name: "expo-image", version: "" },
  { name: "expo-secure-store", version: "" },
  { name: "FlashList", version: "" },
  { name: "date-fns", version: "" },
  { name: "expo-haptics", version: "" },
];

export default function HomeScreen() {
  const { colors, semantic, isDark, scheme } = useAppTheme();
  const { colorSchemePreference, setColorSchemePreference } = useUIStore();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["verification", "posts"],
    queryFn: fetchPosts,
  });

  const themeOptions: Array<"system" | "light" | "dark"> = [
    "system",
    "light",
    "dark",
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl }}
    >
      {/* Theme Switcher */}
      <Animated.View entering={FadeInDown.duration(200)}>
        <Text
          style={{
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.semibold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}
        >
          Theme: {scheme} ({colorSchemePreference})
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          {themeOptions.map((option) => (
            <Pressable
              key={option}
              onPress={() => setColorSchemePreference(option)}
              style={{
                flex: 1,
                paddingVertical: spacing.md,
                borderRadius: radius.md,
                borderCurve: "continuous",
                backgroundColor:
                  colorSchemePreference === option
                    ? colors.primary
                    : colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: fonts.sizes.sm,
                  fontWeight: fonts.weights.medium,
                  color:
                    colorSchemePreference === option
                      ? isDark
                        ? "#0A0E17"
                        : "#FFFFFF"
                      : colors.text,
                  textTransform: "capitalize",
                }}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      {/* Color Palette */}
      <Animated.View entering={FadeInDown.duration(200).delay(50)}>
        <Text
          style={{
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.semibold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}
        >
          Color Palette
        </Text>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.md,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.lg,
            gap: spacing.sm,
          }}
        >
          {(
            Object.keys(themeColorTokens[scheme]) as Array<
              keyof typeof themeColorTokens.light
            >
          ).map((key) => (
            <View
              key={key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.md,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.sm,
                  borderCurve: "continuous",
                  backgroundColor: colors[key],
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
              <Text style={{ color: colors.text, fontSize: fonts.sizes.sm }}>
                {key}
              </Text>
              <Text
                selectable
                style={{
                  color: colors.textMuted,
                  fontSize: fonts.sizes.xs,
                  marginLeft: "auto",
                  fontVariant: ["tabular-nums"],
                }}
              >
                {themeColorTokens[scheme][key]}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Semantic Colors */}
      <Animated.View entering={FadeInDown.duration(200).delay(100)}>
        <Text
          style={{
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.semibold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}
        >
          Semantic Colors
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          {(
            [
              { label: "Income", color: semantic.income, bg: semantic.incomeSoft },
              { label: "Expense", color: semantic.expense, bg: semantic.expenseSoft },
              { label: "Warning", color: semantic.warning, bg: semantic.warningSoft },
              { label: "Info", color: semantic.info, bg: semantic.infoSoft },
            ] as const
          ).map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                backgroundColor: item.bg,
                borderRadius: radius.md,
                borderCurve: "continuous",
                padding: spacing.md,
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: radius.pill,
                  backgroundColor: item.color,
                }}
              />
              <Text
                style={{
                  fontSize: fonts.sizes.xs,
                  fontWeight: fonts.weights.medium,
                  color: item.color,
                }}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Library Status */}
      <Animated.View entering={FadeInDown.duration(200).delay(150)}>
        <Text
          style={{
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.semibold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}
        >
          Installed Libraries
        </Text>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.md,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.lg,
            gap: spacing.sm,
          }}
        >
          {LIBRARIES.map((lib) => (
            <View
              key={lib.name}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: colors.text, fontSize: fonts.sizes.sm }}>
                {lib.name}
              </Text>
              <View
                style={{
                  backgroundColor: semantic.incomeSoft,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: radius.pill,
                }}
              >
                <Text
                  style={{
                    color: semantic.income,
                    fontSize: fonts.sizes.xs,
                    fontWeight: fonts.weights.medium,
                  }}
                >
                  {lib.version ? `✓ ${lib.version}` : "✓"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Data Fetch Test */}
      <Animated.View entering={FadeInDown.duration(200).delay(200)}>
        <Text
          style={{
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.semibold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}
        >
          Data Fetch (Zod validated)
        </Text>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.md,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.lg,
            gap: spacing.md,
          }}
        >
          {isLoading && (
            <Text style={{ color: colors.textMuted, fontSize: fonts.sizes.sm }}>
              Loading posts...
            </Text>
          )}
          {error && (
            <Text
              selectable
              style={{ color: semantic.expense, fontSize: fonts.sizes.sm }}
            >
              Error: {error.message}
            </Text>
          )}
          {posts?.map((post) => (
            <View
              key={post.id}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                paddingBottom: spacing.md,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: fonts.sizes.sm,
                  fontWeight: fonts.weights.medium,
                }}
                numberOfLines={1}
              >
                {post.title}
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: fonts.sizes.xs,
                  marginTop: spacing.xs,
                }}
                numberOfLines={2}
              >
                {post.body}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* expo-image Test */}
      <Animated.View entering={FadeInDown.duration(200).delay(250)}>
        <Text
          style={{
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.semibold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}
        >
          expo-image Test
        </Text>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.md,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            overflow: "hidden",
          }}
        >
          <Image
            source="https://picsum.photos/seed/facets/600/200"
            style={{ width: "100%", height: 160 }}
            contentFit="cover"
            transition={200}
          />
          <View style={{ padding: spacing.lg }}>
            <Text
              style={{
                color: colors.text,
                fontSize: fonts.sizes.sm,
                fontWeight: fonts.weights.medium,
              }}
            >
              Image loaded via expo-image
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: fonts.sizes.xs,
                marginTop: spacing.xs,
              }}
            >
              With built-in caching and transition animation
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* MMKV Storage Test */}
      <Animated.View entering={FadeInDown.duration(200).delay(275)}>
        <Text
          style={{
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.semibold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}
        >
          MMKV Storage Test
        </Text>
        <MMKVDemo colors={colors} semantic={semantic} />
      </Animated.View>

      {/* Spacing & Radius Reference */}
      <Animated.View entering={FadeInDown.duration(200).delay(300)}>
        <Text
          style={{
            fontSize: fonts.sizes.lg,
            fontWeight: fonts.weights.semibold,
            color: colors.text,
            marginBottom: spacing.sm,
          }}
        >
          Spacing Scale
        </Text>
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.md,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.lg,
            gap: spacing.sm,
          }}
        >
          {(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const).map(
            (key) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.md,
                }}
              >
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: fonts.sizes.xs,
                    width: 28,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {key}
                </Text>
                <View
                  style={{
                    height: 12,
                    width: spacing[key],
                    backgroundColor: colors.primary,
                    borderRadius: 2,
                  }}
                />
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: fonts.sizes.xs,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {spacing[key]}px
                </Text>
              </View>
            ),
          )}
        </View>
      </Animated.View>

      <View style={{ height: spacing["2xl"] }} />
    </ScrollView>
  );
}

const MMKV_KEY = "mmkv_demo_counter";

function MMKVDemo({
  colors,
  semantic,
}: {
  colors: ReturnType<typeof useAppTheme>["colors"];
  semantic: ReturnType<typeof useAppTheme>["semantic"];
}) {
  const readCounter = useCallback((): number => {
    return storage.getNumber(MMKV_KEY) ?? 0;
  }, []);

  const [counter, setCounter] = useState(readCounter);
  const [note, setNote] = useState(storage.getString("mmkv_demo_note") ?? "");
  const allKeys = storage.getAllKeys();

  const increment = useCallback(() => {
    const next = counter + 1;
    storage.set(MMKV_KEY, next);
    setCounter(next);
  }, [counter]);

  const decrement = useCallback(() => {
    const next = Math.max(0, counter - 1);
    storage.set(MMKV_KEY, next);
    setCounter(next);
  }, [counter]);

  const reset = useCallback(() => {
    storage.remove(MMKV_KEY);
    storage.remove("mmkv_demo_note");
    setCounter(0);
    setNote("");
  }, []);

  const saveNote = useCallback(
    (text: string) => {
      setNote(text);
      if (text.length > 0) {
        storage.set("mmkv_demo_note", text);
      } else {
        storage.remove("mmkv_demo_note");
      }
    },
    [],
  );

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: radius.md,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        gap: spacing.lg,
      }}
    >
      {/* Counter */}
      <View style={{ alignItems: "center", gap: spacing.sm }}>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fonts.sizes.xs,
            fontWeight: fonts.weights.medium,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Persisted Counter
        </Text>
        <Text
          style={{
            color: colors.primary,
            fontSize: fonts.sizes["4xl"],
            fontWeight: fonts.weights.bold,
            fontVariant: ["tabular-nums"],
          }}
        >
          {counter}
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <Pressable
            onPress={decrement}
            style={{
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.sm,
              backgroundColor: colors.background,
              borderRadius: radius.md,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: fonts.sizes.lg,
                fontWeight: fonts.weights.semibold,
              }}
            >
              −
            </Text>
          </Pressable>
          <Pressable
            onPress={increment}
            style={{
              paddingHorizontal: spacing.xl,
              paddingVertical: spacing.sm,
              backgroundColor: colors.primary,
              borderRadius: radius.md,
              borderCurve: "continuous",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: fonts.sizes.lg,
                fontWeight: fonts.weights.semibold,
              }}
            >
              +
            </Text>
          </Pressable>
        </View>
        <Text style={{ color: colors.textMuted, fontSize: fonts.sizes.xs }}>
          Close & reopen the app — value persists
        </Text>
      </View>

      {/* Note */}
      <View style={{ gap: spacing.sm }}>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fonts.sizes.xs,
            fontWeight: fonts.weights.medium,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Persisted Note
        </Text>
        <TextInput
          value={note}
          onChangeText={saveNote}
          placeholder="Type something..."
          placeholderTextColor={colors.textMuted}
          style={{
            backgroundColor: colors.background,
            borderRadius: radius.sm,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            padding: spacing.md,
            color: colors.text,
            fontSize: fonts.sizes.sm,
          }}
        />
      </View>

      {/* Keys */}
      <View style={{ gap: spacing.sm }}>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: fonts.sizes.xs,
            fontWeight: fonts.weights.medium,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          All MMKV Keys ({allKeys.length})
        </Text>
        {allKeys.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
            {allKeys.map((key) => (
              <View
                key={key}
                style={{
                  backgroundColor: semantic.infoSoft,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: radius.pill,
                }}
              >
                <Text
                  style={{
                    color: semantic.info,
                    fontSize: fonts.sizes.xs,
                    fontWeight: fonts.weights.medium,
                  }}
                >
                  {key}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ color: colors.textMuted, fontSize: fonts.sizes.xs }}>
            No keys stored yet
          </Text>
        )}
      </View>

      {/* Reset */}
      <Pressable
        onPress={reset}
        style={{
          paddingVertical: spacing.sm,
          borderRadius: radius.md,
          borderCurve: "continuous",
          backgroundColor: semantic.expenseSoft,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: semantic.expense,
            fontSize: fonts.sizes.sm,
            fontWeight: fonts.weights.medium,
          }}
        >
          Clear MMKV Demo Data
        </Text>
      </Pressable>
    </View>
  );
}
