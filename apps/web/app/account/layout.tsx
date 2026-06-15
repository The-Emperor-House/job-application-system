import NavLink from "@/components/NavLink";
import { redirect } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { ApiError, authApi } from "@/lib/api";
import { AuthUser } from "@/lib/types";
import LogoutButton from "@/components/LogoutButton";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  let user: AuthUser;
  try {
    user = await authApi<AuthUser>("/api/auth/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  if (user.role !== "APPLICANT") {
    redirect("/dashboard");
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ maxWidth: 768, width: "100%", mx: "auto" }}>
          <Stack direction="row" spacing={3} sx={{ alignItems: "center", flex: 1 }}>
            <Stack component={NavLink} href="/account" direction="row" spacing={1} sx={{ alignItems: "center", textDecoration: "none", color: "inherit" }}>
              <Box component="img" src="/EMP_Logo.svg" alt="Logo" sx={{ height: 32 }} />
              <Typography sx={{ fontWeight: 700 }}>บัญชีของฉัน</Typography>
            </Stack>
            <Typography component={NavLink} href="/" variant="body2" color="text.secondary" sx={{ textDecoration: "none" }}>
              ตำแหน่งงานที่เปิดรับ
            </Typography>
            <Typography component={NavLink} href="/account/profile" variant="body2" color="text.secondary" sx={{ textDecoration: "none" }}>
              ข้อมูลส่วนตัว
            </Typography>
            <Typography component={NavLink} href="/account/documents" variant="body2" color="text.secondary" sx={{ textDecoration: "none" }}>
              เอกสาร
            </Typography>
            <Typography component={NavLink} href="/account/applications" variant="body2" color="text.secondary" sx={{ textDecoration: "none" }}>
              ใบสมัครของฉัน
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {user.name}
            </Typography>
            <LogoutButton />
          </Stack>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
