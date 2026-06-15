"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

export default function AvatarUpload({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/users/me/avatar", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Failed to upload avatar");
      return;
    }

    router.refresh();
  }

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
      <Avatar src={avatarUrl ?? undefined} sx={{ width: 64, height: 64 }}>
        {name.charAt(0).toUpperCase()}
      </Avatar>
      <Stack spacing={1}>
        <Button variant="outlined" component="label" size="small" disabled={uploading}>
          {uploading ? "Uploading..." : "Change avatar"}
          <input type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={handleChange} />
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Stack>
  );
}
