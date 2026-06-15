"use client";

import { useTransition } from "react";
import Button from "@mui/material/Button";
import { deleteApplicationAction } from "./actions";

export default function DeleteApplicationButton({ applicationId }: { applicationId: number }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this application? This cannot be undone.")) {
      return;
    }
    startTransition(() => deleteApplicationAction(applicationId));
  }

  return (
    <Button color="error" variant="outlined" size="small" disabled={pending} onClick={handleDelete}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
