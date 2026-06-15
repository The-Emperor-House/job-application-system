"use client";

import { useTransition } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { ApplicationStatus } from "@/lib/types";
import { updateStatusAction } from "./actions";

const statuses: ApplicationStatus[] = ["PENDING", "REVIEWING", "INTERVIEW", "OFFERED", "REJECTED", "HIRED", "RETURNED"];

export default function StatusSelector({ applicationId, status }: { applicationId: number; status: ApplicationStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <TextField
      key={status}
      select
      defaultValue={status}
      disabled={pending}
      size="small"
      onChange={(e) => startTransition(() => updateStatusAction(applicationId, e.target.value))}
    >
      {statuses.map((s) => (
        <MenuItem key={s} value={s}>
          {s}
        </MenuItem>
      ))}
    </TextField>
  );
}
