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

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function goTo(user: AuthUser) {
    router.push(redirectTo ?? defaultRedirect(user));
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (data.code === "EMAIL_NOT_VERIFIED") {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(data.message ?? "เข้าสู่ระบบไม่สำเร็จ");
      setSubmitting(false);
      return;
    }

    goTo(data.user);
  }

  return (
    <Stack spacing={2}>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField
          label="อีเมล"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          size="small"
        />
        <TextField
          label="รหัสผ่าน"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          size="small"
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" disabled={submitting} fullWidth>
          {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </Stack>

      <Divider>หรือ</Divider>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <GoogleSignInButton onSuccess={goTo} onError={setError} />
      </Box>
    </Stack>
  );
}
