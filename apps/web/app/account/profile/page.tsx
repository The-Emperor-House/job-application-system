import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { authApi } from "@/lib/api";
import { AuthUser } from "@/lib/types";
import AvatarUpload from "@/components/AvatarUpload";
import ProfileForm from "@/components/ProfileForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function ProfilePage() {
  const user = await authApi<AuthUser>("/api/users/me");

  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        ข้อมูลส่วนตัว
      </Typography>
      <AvatarUpload name={user.name} avatarUrl={user.avatarUrl} />
      <ProfileForm user={user} />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        เปลี่ยนรหัสผ่าน
      </Typography>
      <ChangePasswordForm />
    </div>
  );
}
