"use client";

import { useTransition } from "react";
import Button from "@mui/material/Button";
import { deleteApplicationAction } from "./actions";

export default function DeleteApplicationButton({ applicationId }: { applicationId: number }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("ลบใบสมัครนี้? การลบไม่สามารถย้อนกลับได้")) {
      return;
    }
    startTransition(() => deleteApplicationAction(applicationId));
  }

  return (
    <Button color="error" variant="outlined" size="small" disabled={pending} onClick={handleDelete}>
      {pending ? "กำลังลบ..." : "ลบ"}
    </Button>
  );
}
