"use client";

import { useTransition } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { UserRole } from "@/lib/types";
import { updateUserRoleAction } from "./actions";
import { userRoleLabel } from "@/lib/labels";

const roles: UserRole[] = ["SUPER_ADMIN", "ADMIN", "HR", "APPLICANT"];

export default function RoleSelector({ userId, role }: { userId: number; role: UserRole }) {
  const [pending, startTransition] = useTransition();

  return (
    <TextField
      key={role}
      select
      defaultValue={role}
      disabled={pending}
      size="small"
      onChange={(e) => startTransition(() => updateUserRoleAction(userId, e.target.value))}
    >
      {roles.map((r) => (
        <MenuItem key={r} value={r}>
          {userRoleLabel[r] ?? r}
        </MenuItem>
      ))}
    </TextField>
  );
}
