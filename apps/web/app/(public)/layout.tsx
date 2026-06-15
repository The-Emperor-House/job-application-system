import NavLink from "@/components/NavLink";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { ApiError, authApi } from "@/lib/api";
import { AuthUser } from "@/lib/types";
import LogoutButton from "@/components/LogoutButton";
import SiteNavBar from "@/components/SiteNavBar";

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
      <SiteNavBar
        logoHref="/"
        logoLabel="ระบบรับสมัครงาน"
        links={[{ href: "/", label: "ตำแหน่งงานที่เปิดรับ" }]}
        right={
          user ? (
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
          )
        }
      />

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
