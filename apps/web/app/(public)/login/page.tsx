import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <Container component="main" maxWidth="xs" sx={{ flex: 1, display: "flex", alignItems: "center", py: 8 }}>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
          Sign in
        </Typography>
        <LoginForm redirectTo={from} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "var(--mui-palette-primary-main)" }}>
            Create one
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
