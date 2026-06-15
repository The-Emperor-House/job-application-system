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
import { employmentTypeLabel, jobStatusLabel } from "@/lib/labels";

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
          <TextField name="title" label="ชื่อตำแหน่งงาน" required fullWidth size="small" defaultValue={job?.title} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField name="department" label="แผนก" fullWidth size="small" defaultValue={job?.department ?? ""} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField name="location" label="สถานที่ทำงาน" fullWidth size="small" defaultValue={job?.location ?? ""} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField name="salaryRange" label="ช่วงเงินเดือน" fullWidth size="small" defaultValue={job?.salaryRange ?? ""} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="employmentType"
            label="ประเภทการจ้างงาน"
            select
            fullWidth
            size="small"
            defaultValue={job?.employmentType ?? "FULL_TIME"}
          >
            {employmentTypes.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {employmentTypeLabel[opt] ?? opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField name="status" label="สถานะ" select fullWidth size="small" defaultValue={job?.status ?? "OPEN"}>
            {jobStatuses.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {jobStatusLabel[opt] ?? opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="closingDate"
            label="วันที่ปิดรับสมัคร"
            type="date"
            fullWidth
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            defaultValue={job?.closingDate ? job.closingDate.slice(0, 10) : ""}
          />
        </Grid>
      </Grid>

      <TextField name="description" label="รายละเอียดงาน" required multiline minRows={4} fullWidth size="small" defaultValue={job?.description} />
      <TextField name="requirements" label="คุณสมบัติที่ต้องการ" multiline minRows={4} fullWidth size="small" defaultValue={job?.requirements ?? ""} />

      {state.error && <Alert severity="error">{state.error}</Alert>}

      <Button type="submit" variant="contained" disabled={pending} sx={{ alignSelf: "flex-start" }}>
        {pending ? "กำลังบันทึก..." : "บันทึก"}
      </Button>
    </Stack>
  );
}
