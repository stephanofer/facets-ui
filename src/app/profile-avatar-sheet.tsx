import { ProfileAvatarSheetContent } from "@/features/auth/components/profile-avatar-sheet-content";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";

export default function ProfileAvatarSheetScreen() {
  const { data: session } = useAuthSession();

  return <ProfileAvatarSheetContent hasAvatar={Boolean(session?.user.avatar?.url)} />;
}
