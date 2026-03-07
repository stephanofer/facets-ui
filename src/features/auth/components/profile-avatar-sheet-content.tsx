import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/icon";
import { fonts, radius, spacing } from "@/constants/theme";
import { ApiError } from "@/lib/api-client";
import { useAppTheme } from "@/hooks/use-app-theme";
import {
  useDeleteAvatar,
  useUploadAvatar,
} from "@/features/auth/hooks/use-avatar-mutations";

import type { ImagePickerAsset, ImagePickerResult } from "expo-image-picker";

interface ProfileAvatarSheetContentProps {
  hasAvatar: boolean;
}

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

function buildImageFormData(asset: ImagePickerAsset): FormData {
  const formData = new FormData();

  if (asset.file) {
    formData.append("file", asset.file);
    return formData;
  }

  const extension = asset.mimeType?.split("/")[1] ?? "jpg";

  formData.append("file", {
    uri: asset.uri,
    name: asset.fileName ?? `avatar.${extension}`,
    type: asset.mimeType ?? "image/jpeg",
  } as unknown as Blob);

  return formData;
}

function validateAsset(asset: ImagePickerAsset) {
  const mimeType = asset.mimeType ?? "image/jpeg";

  if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
    throw new Error("Solo podés subir imágenes JPG, PNG o WEBP.");
  }

  if (asset.fileSize && asset.fileSize > MAX_AVATAR_SIZE_BYTES) {
    throw new Error("La imagen no puede superar 2MB.");
  }
}

async function ensurePermission(kind: "camera" | "gallery") {
  if (kind === "camera") {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      throw new Error("Necesitamos permiso para usar la cámara.");
    }
    return;
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Necesitamos permiso para acceder a tu galería.");
  }
}

async function pickAsset(kind: "camera" | "gallery"): Promise<ImagePickerResult> {
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1] as [number, number],
    quality: 0.9,
  };

  if (kind === "camera") {
    return ImagePicker.launchCameraAsync(options);
  }

  return ImagePicker.launchImageLibraryAsync(options);
}

function SheetAction({
  icon,
  label,
  destructive = false,
  onPress,
  disabled,
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  destructive?: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        minHeight: 58,
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        opacity: disabled ? 0.45 : pressed ? 0.72 : 1,
        backgroundColor: pressed ? colors.background : "transparent",
      })}
    >
      <Icon
        name={icon}
        size={24}
        color={destructive ? "#BE123C" : colors.textMuted}
      />
      <Text
        style={{
          color: destructive ? "#BE123C" : colors.text,
          fontSize: fonts.sizes.xl,
          fontWeight: fonts.weights.medium,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ProfileAvatarSheetContent({
  hasAvatar,
}: ProfileAvatarSheetContentProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useDeleteAvatar();

  const isBusy = uploadAvatar.isPending || removeAvatar.isPending;

  const closeSheet = () => {
    router.back();
  };

  const handleError = (error: unknown) => {
    const message =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : "No pudimos actualizar tu foto.";

    Alert.alert("No se pudo actualizar", message);
  };

  const handlePick = async (kind: "camera" | "gallery") => {
    try {
      if (process.env.EXPO_OS === "ios") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      await ensurePermission(kind);
      const result = await pickAsset(kind);

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      validateAsset(asset);

      await uploadAvatar.mutateAsync(buildImageFormData(asset));
      closeSheet();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (process.env.EXPO_OS === "ios") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      await removeAvatar.mutateAsync();
      closeSheet();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.card,
        paddingTop: spacing.md,
        paddingHorizontal: spacing.xl,
        paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.md,
        gap: spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.md,
        }}
      >
        <View style={{ flex: 1 }} />
        <Text
          style={{
            color: colors.text,
            fontSize: fonts.sizes["3xl"],
            fontWeight: fonts.weights.bold,
            textAlign: "center",
            flex: 2,
          }}
        >
          Edición de foto
        </Text>
        <Pressable
          onPress={closeSheet}
          hitSlop={12}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.5 : 1,
            flex: 1,
          })}
        >
          <Icon name="X" size={26} color={colors.text} />
        </Pressable>
      </View>

      <View style={{ gap: spacing.sm }}>
        <SheetAction
          icon="Camera"
          label="Tomar una foto"
          onPress={() => handlePick("camera")}
          disabled={isBusy}
        />
        <SheetAction
          icon="Image"
          label="Elegir de la galería"
          onPress={() => handlePick("gallery")}
          disabled={isBusy}
        />
        {hasAvatar ? (
          <SheetAction
            icon="Trash"
            label="Eliminar foto"
            destructive
            onPress={handleDelete}
            disabled={isBusy}
          />
        ) : null}
      </View>
    </View>
  );
}
