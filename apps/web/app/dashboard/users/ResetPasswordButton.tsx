"use client";

import { useActionState, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { resetUserPasswordAction, ResetPasswordFormState } from "./actions";

export default function ResetPasswordButton({ userId, name }: { userId: number; name: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ResetPasswordFormState, FormData>(
    resetUserPasswordAction.bind(null, userId),
    {}
  );

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Reset Password
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Reset password for {name}</DialogTitle>
        <Stack component="form" action={formAction} spacing={2} sx={{ px: 3, pb: 1 }}>
          <DialogContent sx={{ p: 0 }}>
            <Stack spacing={2}>
              <TextField label="New password" name="newPassword" type="password" required fullWidth size="small" helperText="At least 8 characters" />
              <TextField label="Confirm new password" name="confirmPassword" type="password" required fullWidth size="small" />
              {state.error && <Alert severity="error">{state.error}</Alert>}
              {state.success && <Alert severity="success">Password reset successfully.</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 0 }}>
            <Button onClick={() => setOpen(false)}>Close</Button>
            <Button type="submit" variant="contained" disabled={pending}>
              {pending ? "Saving..." : "Reset"}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  );
}
