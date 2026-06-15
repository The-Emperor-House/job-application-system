"use client";

import { useTransition } from "react";
import Switch from "@mui/material/Switch";
import { updateUserActiveAction } from "./actions";

export default function ActiveToggle({ userId, isActive }: { userId: number; isActive: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <Switch
      defaultChecked={isActive}
      disabled={pending}
      onChange={(e) => startTransition(() => updateUserActiveAction(userId, e.target.checked))}
    />
  );
}
