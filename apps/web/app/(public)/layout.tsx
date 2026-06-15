import NavLink from "@/components/NavLink";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { ApiError, authApi } from "@/lib/api";
import { AuthUser } from "@/lib/types";
import LogoutButton from "@/components/LogoutButton";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let user: AuthUser | null = null;
  try {
    user = await authApi<AuthUser>("/api/auth/me");
  } catch (err) {
    if (!(err instanceof ApiError && err.status === 401)) {
      throw err;
    }
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ maxWidth: 1024, width: "100%", mx: "auto" }}>
          <Stack direction="row" spacing={3} sx={{ alignItems: "center", flex: 1 }}>
            <Stack component={NavLink} href="/" direction="row" spacing={1} sx={{ alignItems: "center", textDecoration: "none", color: "inherit" }}>
              <Box component="img" src="/EMP_Logo.svg" alt="Logo" sx={{ height: 32 }} />
              <Typography sx={{ fontWeight: 700 }}>ระบบรับสมัครงาน</Typography>
            </Stack>
            <Typography component={NavLink} href="/" variant="body2" color="text.secondary" sx={{ textDecoration: "none" }}>
              ตำแหน่งงานที่เปิดรับ
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            {user ? (
              <>
                <Button component={NavLink} href={user.role === "APPLICANT" ? "/account" : "/dashboard"} size="small" color="inherit">
                  {user.role === "APPLICANT" ? "บัญชีของฉัน" : "แดชบอร์ด"}
                </Button>
                <LogoutButton />
              </>
            ) : (
              <>
                <Button component={NavLink} href="/login" size="small" color="inherit">
                  เข้าสู่ระบบ
                </Button>
                <Button component={NavLink} href="/register" size="small" variant="contained">
                  ลงทะเบียน
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {children}

      <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 3, mt: "auto" }}>
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} ระบบรับสมัครงาน สงวนสิทธิ์ทุกประการ
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
