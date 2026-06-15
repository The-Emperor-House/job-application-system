"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { AuthUser } from "@/lib/types";
import GoogleSignInButton from "./GoogleSignInButton";

function defaultRedirect(user: AuthUser) {
  return user.role === "APPLICANT" ? "/account" : "/dashboard";
}

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.message ?? "Registration failed");
      setSubmitting(false);
      return;
    }

    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  }

  return (
    <Stack spacing={2}>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth size="small" />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          size="small"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          size="small"
          helperText="At least 8 characters"
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" disabled={submitting} fullWidth>
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </Stack>

      <Divider>or</Divider>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <GoogleSignInButton
          onSuccess={(user) => {
            router.push(defaultRedirect(user));
            router.refresh();
          }}
          onError={setError}
        />
      </Box>
    </Stack>
  );
}
