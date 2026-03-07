import { ProfileAvatarSheetContent } from "@/features/auth/components/profile-avatar-sheet-content";
import { useUser } from "@/features/auth/hooks/use-user";
import { useAuthStore } from "@/stores/auth-store";

export default function ProfileAvatarSheetScreen() {
  const { data: user } = useUser();
  const localUser = useAuthStore((s) => s.user);
  const displayUser = user ?? localUser;

  return <ProfileAvatarSheetContent hasAvatar={Boolean(displayUser?.avatar?.url)} />;
}
