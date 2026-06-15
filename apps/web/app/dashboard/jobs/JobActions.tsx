"use client";

import { useState, useTransition } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import { deleteJobAction, setJobStatusAction } from "./actions";
import { JobStatus } from "@/lib/types";

type DialogKind = "delete" | "close" | "reopen" | null;

export default function JobActions({ jobId, status }: { jobId: number; status: JobStatus }) {
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openDialog(kind: DialogKind) {
    setError(null);
    setDialog(kind);
  }

  function closeDialog() {
    if (pending) return;
    setDialog(null);
    setError(null);
  }

  function confirm() {
    setError(null);
    startTransition(async () => {
      let result;
      if (dialog === "delete") {
        result = await deleteJobAction(jobId);
      } else if (dialog === "close") {
        result = await setJobStatusAction(jobId, "CLOSED");
      } else if (dialog === "reopen") {
        result = await setJobStatusAction(jobId, "OPEN");
      } else {
        return;
      }

      if (result?.error) {
        setError(result.error);
      } else {
        setDialog(null);
      }
    });
  }

  const dialogCopy: Record<Exclude<DialogKind, null>, { title: string; body: string; confirmLabel: string; color: "error" | "primary" }> = {
    delete: {
      title: "ลบตำแหน่งงานนี้?",
      body: "การลบตำแหน่งงานนี้ไม่สามารถย้อนกลับได้",
      confirmLabel: "ลบ",
      color: "error",
    },
    close: {
      title: "ปิดรับสมัครตำแหน่งงานนี้?",
      body: "การปิดรับสมัครจะซ่อนตำแหน่งงานนี้จากผู้สมัครและหยุดรับใบสมัครใหม่ คุณสามารถเปิดรับสมัครอีกครั้งได้ในภายหลัง",
      confirmLabel: "ปิดรับสมัคร",
      color: "primary",
    },
    reopen: {
      title: "เปิดรับสมัครตำแหน่งงานนี้อีกครั้ง?",
      body: "การเปิดรับสมัครอีกครั้งจะทำให้ผู้สมัครมองเห็นตำแหน่งงานนี้ได้",
      confirmLabel: "เปิดรับสมัคร",
      color: "primary",
    },
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        {status === "OPEN" ? (
          <Button size="small" onClick={() => openDialog("close")}>
            ปิดรับสมัคร
          </Button>
        ) : (
          <Button size="small" onClick={() => openDialog("reopen")}>
            เปิดรับสมัคร
          </Button>
        )}
        <Button size="small" color="error" onClick={() => openDialog("delete")}>
          ลบ
        </Button>
      </Stack>

      <Dialog open={dialog !== null} onClose={closeDialog}>
        {dialog && (
          <>
            <DialogTitle>{dialogCopy[dialog].title}</DialogTitle>
            <DialogContent>
              <DialogContentText>{dialogCopy[dialog].body}</DialogContentText>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} disabled={pending}>
                ยกเลิก
              </Button>
              <Button onClick={confirm} color={dialogCopy[dialog].color} disabled={pending} variant="contained">
                {pending ? "กำลังดำเนินการ..." : dialogCopy[dialog].confirmLabel}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
