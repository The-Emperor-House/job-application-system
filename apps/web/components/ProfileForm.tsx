"use client";

import { useActionState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { AuthUser } from "@/lib/types";
import { updateProfileAction, ProfileFormState } from "@/app/account/actions";

export default function ProfileForm({ user }: { user: AuthUser }) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(updateProfileAction, {});

  return (
    <Stack component="form" action={formAction} spacing={2} sx={{ maxWidth: 480 }}>
      <TextField label="Name" name="name" defaultValue={user.name} required fullWidth size="small" />
      <TextField label="Email" value={user.email} disabled fullWidth size="small" />
      <TextField label="Phone" name="phone" defaultValue={user.phone ?? ""} fullWidth size="small" />
      <TextField label="Address" name="address" defaultValue={user.address ?? ""} multiline minRows={2} fullWidth size="small" />

      {state.error && <Alert severity="error">{state.error}</Alert>}
      {state.success && <Alert severity="success">Profile updated.</Alert>}

      <Button type="submit" variant="contained" disabled={pending} sx={{ alignSelf: "flex-start" }}>
        {pending ? "Saving..." : "Save"}
      </Button>
    </Stack>
  );
}
