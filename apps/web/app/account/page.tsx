import NavLink from "@/components/NavLink";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { authApi } from "@/lib/api";
import { AuthUser } from "@/lib/types";

export default async function AccountOverviewPage() {
  const user = await authApi<AuthUser>("/api/users/me");

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 4 }}>
        <Avatar src={user.avatarUrl ?? undefined} sx={{ width: 64, height: 64 }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <NavCard href="/account/profile" label="ข้อมูลส่วนตัว" description="แก้ไขข้อมูลส่วนตัวและรูปโปรไฟล์ของคุณ" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <NavCard href="/account/documents" label="เอกสาร" description="จัดการเรซูเม่ พอร์ตโฟลิโอ และไฟล์อื่นๆ" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <NavCard href="/account/applications" label="ใบสมัครของฉัน" description="ติดตามสถานะใบสมัครของคุณ" />
        </Grid>
      </Grid>
    </div>
  );
}

function NavCard({ href, label, description }: { href: string; label: string; description: string }) {
  return (
    <Card variant="outlined">
      <CardActionArea component={NavLink} href={href}>
        <CardContent>
          <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
