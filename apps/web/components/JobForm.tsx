"use client";

import { useActionState } from "react";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { JobFormState } from "@/app/dashboard/jobs/actions";
import { JobPosting } from "@/lib/types";

const employmentTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
const jobStatuses = ["OPEN", "CLOSED"];

export default function JobForm({
  action,
  job,
}: {
  action: (prevState: JobFormState, formData: FormData) => Promise<JobFormState>;
  job?: JobPosting;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <Stack component="form" action={formAction} spacing={2} sx={{ maxWidth: 640 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField name="title" label="Title" required fullWidth size="small" defaultValue={job?.title} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField name="department" label="Department" fullWidth size="small" defaultValue={job?.department ?? ""} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField name="location" label="Location" fullWidth size="small" defaultValue={job?.location ?? ""} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField name="salaryRange" label="Salary range" fullWidth size="small" defaultValue={job?.salaryRange ?? ""} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="employmentType"
            label="Employment type"
            select
            fullWidth
            size="small"
            defaultValue={job?.employmentType ?? "FULL_TIME"}
          >
            {employmentTypes.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField name="status" label="Status" select fullWidth size="small" defaultValue={job?.status ?? "OPEN"}>
            {jobStatuses.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="closingDate"
            label="Closing date"
            type="date"
            fullWidth
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            defaultValue={job?.closingDate ? job.closingDate.slice(0, 10) : ""}
          />
        </Grid>
      </Grid>

      <TextField name="description" label="Description" required multiline minRows={4} fullWidth size="small" defaultValue={job?.description} />
      <TextField name="requirements" label="Requirements" multiline minRows={4} fullWidth size="small" defaultValue={job?.requirements ?? ""} />

      {state.error && <Alert severity="error">{state.error}</Alert>}

      <Button type="submit" variant="contained" disabled={pending} sx={{ alignSelf: "flex-start" }}>
        {pending ? "Saving..." : "Save"}
      </Button>
    </Stack>
  );
}
