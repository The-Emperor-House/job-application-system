import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ApiError, authApi } from "@/lib/api";
import { AuthUser } from "@/lib/types";
import LogoutButton from "@/components/LogoutButton";
import SiteNavBar from "@/components/SiteNavBar";

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
      <SiteNavBar
        logoHref="/account"
        logoLabel="บัญชีของฉัน"
        links={[
          { href: "/", label: "ตำแหน่งงานที่เปิดรับ" },
          { href: "/account/profile", label: "ข้อมูลส่วนตัว" },
          { href: "/account/documents", label: "เอกสาร" },
          { href: "/account/applications", label: "ใบสมัครของฉัน" },
        ]}
        right={
          <>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
              {user.name}
            </Typography>
            <LogoutButton />
          </>
        }
      />
      <Container component="main" maxWidth="sm" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
