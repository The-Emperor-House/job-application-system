"use client";

import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ flex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}
    >
      <Box>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
          Oops
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          An unexpected error occurred. You can try again or head back to the home page.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
          <Button onClick={() => reset()} variant="outlined" size="large">
            Try again
          </Button>
          <Button component={Link} href="/" variant="contained" size="large">
            Back to home
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
