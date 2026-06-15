import NavLink from "@/components/NavLink";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { authApi } from "@/lib/api";
import { JobPosting } from "@/lib/types";
import JobActions from "./JobActions";

export default async function AdminJobsPage() {
  const jobs = await authApi<JobPosting[]>("/api/jobs/admin/all");

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Job Postings
        </Typography>
        <Button component={NavLink} href="/dashboard/jobs/new" variant="contained">
          + New job posting
        </Button>
      </Box>

      <Paper variant="outlined">
        <Stack>
          {jobs.map((job, i) => (
            <Box key={job.id}>
              {i > 0 && <Divider />}
              <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 500 }}>{job.title}</Typography>
                    <Chip
                      label={job.status}
                      size="small"
                      color={job.status === "OPEN" ? "success" : "default"}
                      variant="outlined"
                    />
                    {job.status === "OPEN" && job.closingDate && new Date(job.closingDate) < new Date() && (
                      <Chip label="Expired" size="small" color="warning" variant="outlined" />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {job.department} · {job._count?.applications ?? 0} applications
                  </Typography>
                </div>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Button component={NavLink} href={`/dashboard/jobs/${job.id}/edit`} size="small">
                    Edit
                  </Button>
                  <JobActions jobId={job.id} status={job.status} />
                </Stack>
              </Box>
            </Box>
          ))}
          {jobs.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No job postings yet.
            </Typography>
          )}
        </Stack>
      </Paper>
    </div>
  );
}
