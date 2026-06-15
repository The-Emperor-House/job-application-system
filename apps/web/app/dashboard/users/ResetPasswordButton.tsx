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
        รีเซ็ตรหัสผ่าน
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>รีเซ็ตรหัสผ่านสำหรับ {name}</DialogTitle>
        <Stack component="form" action={formAction} spacing={2} sx={{ px: 3, pb: 1 }}>
          <DialogContent sx={{ p: 0 }}>
            <Stack spacing={2}>
              <TextField label="รหัสผ่านใหม่" name="newPassword" type="password" required fullWidth size="small" helperText="อย่างน้อย 8 ตัวอักษร" />
              <TextField label="ยืนยันรหัสผ่านใหม่" name="confirmPassword" type="password" required fullWidth size="small" />
              {state.error && <Alert severity="error">{state.error}</Alert>}
              {state.success && <Alert severity="success">รีเซ็ตรหัสผ่านสำเร็จ</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 0 }}>
            <Button onClick={() => setOpen(false)}>ปิด</Button>
            <Button type="submit" variant="contained" disabled={pending}>
              {pending ? "กำลังบันทึก..." : "รีเซ็ต"}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  );
}
