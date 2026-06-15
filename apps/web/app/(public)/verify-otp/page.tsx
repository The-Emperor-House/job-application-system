import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import VerifyOtpForm from "@/components/VerifyOtpForm";

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <Container component="main" maxWidth="xs" sx={{ flex: 1, display: "flex", alignItems: "center", py: 8 }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}>
          ยืนยันอีเมลของคุณ
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
          {email
            ? `กรอกรหัสยืนยันที่ส่งไปยัง ${email}`
            : "กรอกรหัสยืนยันที่ส่งไปยังอีเมลของคุณ"}
        </Typography>
        <VerifyOtpForm email={email ?? ""} />
      </Box>
    </Container>
  );
}
