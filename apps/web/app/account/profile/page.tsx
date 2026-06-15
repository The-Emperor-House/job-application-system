import Typography from "@mui/material/Typography";
import { authApi } from "@/lib/api";
import { AuthUser } from "@/lib/types";
import AvatarUpload from "@/components/AvatarUpload";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const user = await authApi<AuthUser>("/api/users/me");

  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Profile
      </Typography>
      <AvatarUpload name={user.name} avatarUrl={user.avatarUrl} />
      <ProfileForm user={user} />
    </div>
  );
}
