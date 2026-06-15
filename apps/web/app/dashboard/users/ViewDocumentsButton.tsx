"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import { UserDocument } from "@/lib/types";
import { documentCategoryLabel } from "@/lib/labels";
import { getUserDocumentsAction } from "./actions";

export default function ViewDocumentsButton({ userId, name }: { userId: number; name: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<UserDocument[] | null>(null);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);
    try {
      setDocuments(await getUserDocumentsAction(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถโหลดเอกสารได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="small" onClick={handleOpen}>
        ดูเอกสาร
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>เอกสารของ {name}</DialogTitle>
        <DialogContent>
          {loading && <Typography variant="body2">กำลังโหลด...</Typography>}
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          {!loading && !error && documents?.length === 0 && (
            <Typography variant="body2" color="text.disabled">
              ยังไม่มีเอกสารที่อัปโหลด
            </Typography>
          )}
          {!loading && !error && documents && documents.length > 0 && (
            <Stack spacing={1.5}>
              {documents.map((doc) => (
                <Box key={doc.id}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
                    <Chip label={documentCategoryLabel[doc.category] ?? doc.category} size="small" />
                    <Link href={doc.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "var(--mui-palette-primary-main)" }}>
                      {doc.fileName}
                    </Link>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    อัปโหลดเมื่อ {new Date(doc.uploadedAt).toLocaleDateString("th-TH")}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
