import NavLink from "@/components/NavLink";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { authApi } from "@/lib/api";
import { JobApplication, JobPosting, PaginatedResult } from "@/lib/types";

export default async function DashboardPage() {
  const [jobs, applications, pendingApplications] = await Promise.all([
    authApi<JobPosting[]>("/api/jobs/admin/all"),
    authApi<PaginatedResult<JobApplication>>("/api/applications?pageSize=1"),
    authApi<PaginatedResult<JobApplication>>("/api/applications?status=PENDING&pageSize=1"),
  ]);

  const openJobs = jobs.filter((j) => j.status === "OPEN").length;
  const pending = pendingApplications.total;

  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Open job postings" value={openJobs} href="/dashboard/jobs" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Total applications" value={applications.total} href="/dashboard/applications" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Pending review" value={pending} href="/dashboard/applications?status=PENDING" />
        </Grid>
      </Grid>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Card variant="outlined">
      <CardActionArea component={NavLink} href={href}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
            {value}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
