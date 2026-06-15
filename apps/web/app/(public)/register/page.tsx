import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <Container component="main" maxWidth="xs" sx={{ flex: 1, display: "flex", alignItems: "center", py: 8 }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
          สร้างบัญชี
        </Typography>
        <RegisterForm />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" style={{ color: "var(--mui-palette-primary-main)" }}>
            เข้าสู่ระบบ
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
