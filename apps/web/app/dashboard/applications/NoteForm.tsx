"use client";

import { useActionState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { addNoteAction } from "./actions";

export default function NoteForm({ applicationId }: { applicationId: number }) {
  const action = addNoteAction.bind(null, applicationId);
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <Stack component="form" action={formAction} spacing={1.5}>
      <TextField name="note" multiline minRows={3} placeholder="Add an internal note..." size="small" fullWidth />
      {state.error && <Alert severity="error">{state.error}</Alert>}
      <Button type="submit" variant="contained" size="small" disabled={pending} sx={{ alignSelf: "flex-start" }}>
        {pending ? "Saving..." : "Add note"}
      </Button>
    </Stack>
  );
}
