"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { DocumentCategory } from "@/lib/types";

const categories: DocumentCategory[] = ["RESUME", "PORTFOLIO", "CERTIFICATE", "OTHER"];

export default function DocumentUpload() {
  const router = useRouter();
  const [category, setCategory] = useState<DocumentCategory>("RESUME");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please choose a file");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const res = await fetch("/api/users/me/documents", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Failed to upload document");
      return;
    }

    setFile(null);
    router.refresh();
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
      <TextField
        select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as DocumentCategory)}
        size="small"
        sx={{ minWidth: 160 }}
      >
        {categories.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="outlined" component="label" sx={{ flex: 1 }}>
        {file ? file.name : "Choose file"}
        <input type="file" hidden accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </Button>
      <Button type="submit" variant="contained" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
