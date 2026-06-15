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
      title: "Delete job posting?",
      body: "This will permanently delete the job posting. This cannot be undone.",
      confirmLabel: "Delete",
      color: "error",
    },
    close: {
      title: "Close job posting?",
      body: "Closing will hide this posting from applicants and stop new applications. You can reopen it later.",
      confirmLabel: "Close posting",
      color: "primary",
    },
    reopen: {
      title: "Reopen job posting?",
      body: "Reopening will make this posting visible to applicants again.",
      confirmLabel: "Reopen posting",
      color: "primary",
    },
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        {status === "OPEN" ? (
          <Button size="small" onClick={() => openDialog("close")}>
            Close
          </Button>
        ) : (
          <Button size="small" onClick={() => openDialog("reopen")}>
            Reopen
          </Button>
        )}
        <Button size="small" color="error" onClick={() => openDialog("delete")}>
          Delete
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
                Cancel
              </Button>
              <Button onClick={confirm} color={dialogCopy[dialog].color} disabled={pending} variant="contained">
                {pending ? "Working..." : dialogCopy[dialog].confirmLabel}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
