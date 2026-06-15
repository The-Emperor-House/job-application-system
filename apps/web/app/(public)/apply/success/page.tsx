import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function ApplySuccessPage() {
  return (
    <Container component="main" maxWidth="sm" sx={{ flex: 1, py: 12, textAlign: "center" }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        Application submitted!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Thank you for applying. Our HR team will review your application and contact you if you are
        selected for the next step.
      </Typography>
      <Link href="/" style={{ color: "var(--mui-palette-primary-main)" }}>
        ← Back to open positions
      </Link>
    </Container>
  );
}
