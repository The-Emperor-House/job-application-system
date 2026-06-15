"use client";

import { useTransition } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { UserDocument } from "@/lib/types";
import { deleteDocumentAction } from "@/app/account/actions";

export default function DocumentList({ documents }: { documents: UserDocument[] }) {
  const [pending, startTransition] = useTransition();

  if (documents.length === 0) {
    return (
      <Typography variant="body2" color="text.disabled">
        No documents uploaded yet.
      </Typography>
    );
  }

  return (
    <Paper variant="outlined">
      <Stack divider={<Divider />}>
        {documents.map((doc) => (
          <Box key={doc.id} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
                <Chip label={doc.category} size="small" />
                <Link href={doc.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "var(--mui-palette-primary-main)" }}>
                  {doc.fileName}
                </Link>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Button
              size="small"
              color="error"
              disabled={pending}
              onClick={() => {
                if (!confirm("Delete this document?")) return;
                startTransition(() => {
                  deleteDocumentAction(doc.id);
                });
              }}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
