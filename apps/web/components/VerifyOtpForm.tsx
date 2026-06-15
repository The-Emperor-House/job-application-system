"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { AuthUser } from "@/lib/types";

function defaultRedirect(user: AuthUser) {
  return user.role === "APPLICANT" ? "/account" : "/dashboard";
}

export default function VerifyOtpForm({ email }: { email: string }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setInfo(null);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.message ?? "Verification failed");
      setSubmitting(false);
      return;
    }

    router.push(defaultRedirect(data.user));
    router.refresh();
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    setInfo(null);

    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({}));
    setResending(false);

    if (!res.ok) {
      setError(data.message ?? "Failed to resend code");
      return;
    }

    setInfo("A new verification code has been sent to your email.");
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <TextField
        label="Verification code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
        fullWidth
        size="small"
        slotProps={{ htmlInput: { maxLength: 6, inputMode: "numeric" } }}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {info && <Alert severity="success">{info}</Alert>}
      <Button type="submit" variant="contained" disabled={submitting} fullWidth>
        {submitting ? "Verifying..." : "Verify"}
      </Button>
      <Button type="button" onClick={handleResend} disabled={resending} fullWidth>
        {resending ? "Sending..." : "Resend code"}
      </Button>
    </Stack>
  );
}
