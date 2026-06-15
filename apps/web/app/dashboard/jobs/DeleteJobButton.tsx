"use client";

import { useTransition } from "react";
import Button from "@mui/material/Button";
import { deleteJobAction } from "./actions";

export default function DeleteJobButton({ jobId }: { jobId: number }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;
    startTransition(() => {
      deleteJobAction(jobId);
    });
  }

  return (
    <Button onClick={handleDelete} disabled={pending} size="small" color="error">
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
