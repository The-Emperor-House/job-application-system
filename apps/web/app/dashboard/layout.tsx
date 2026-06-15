import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { ApiError, authApi } from "@/lib/api";
import { AuthUser } from "@/lib/types";
import { userRoleLabel } from "@/lib/labels";
import LogoutButton from "@/components/LogoutButton";
import SiteNavBar from "@/components/SiteNavBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let user: AuthUser;
  try {
    user = await authApi<AuthUser>("/api/auth/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  if (user.role === "APPLICANT") {
    redirect("/account");
  }

  const links = [
    { href: "/dashboard/jobs", label: "ตำแหน่งงาน" },
    { href: "/dashboard/applications", label: "ใบสมัคร" },
    ...(user.role === "SUPER_ADMIN" ? [{ href: "/dashboard/users", label: "ผู้ใช้งาน" }] : []),
  ];

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <SiteNavBar
        logoHref="/dashboard"
        logoLabel="แดชบอร์ด HR"
        links={links}
        maxWidth={1280}
        right={
          <>
            <Stack sx={{ alignItems: "flex-end", display: { xs: "none", sm: "flex" } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                {user.name}
              </Typography>
              <Chip label={userRoleLabel[user.role] ?? user.role} size="small" sx={{ height: 18, fontSize: 11 }} />
            </Stack>
            <LogoutButton />
          </>
        }
      />
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
