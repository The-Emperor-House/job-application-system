"use client";

import { useActionState, useRef } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { changePasswordAction, ChangePasswordFormState } from "@/app/account/actions";

export default function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ChangePasswordFormState, FormData>(
    async (prevState, formData) => {
      const result = await changePasswordAction(prevState, formData);
      if (result.success) {
        formRef.current?.reset();
      }
      return result;
    },
    {}
  );

  return (
    <Stack ref={formRef} component="form" action={formAction} spacing={2} sx={{ maxWidth: 480 }}>
      <TextField label="Current password" name="currentPassword" type="password" required fullWidth size="small" />
      <TextField label="New password" name="newPassword" type="password" required fullWidth size="small" helperText="At least 8 characters" />
      <TextField label="Confirm new password" name="confirmPassword" type="password" required fullWidth size="small" />

      {state.error && <Alert severity="error">{state.error}</Alert>}
      {state.success && <Alert severity="success">Password changed.</Alert>}

      <Button type="submit" variant="contained" disabled={pending} sx={{ alignSelf: "flex-start" }}>
        {pending ? "Saving..." : "Change Password"}
      </Button>
    </Stack>
  );
}
