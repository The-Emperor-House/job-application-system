import Link from "next/link";
import NavLink from "@/components/NavLink";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { publicApi } from "@/lib/api";
import { JobPosting } from "@/lib/types";

const employmentTypeLabel: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export default async function HomePage() {
  const jobs = await publicApi<JobPosting[]>("/api/jobs");

  return (
    <Container component="main" maxWidth="md" sx={{ flex: 1, py: 6 }}>
      <Box component="header" sx={{ mb: 5 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Open Positions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Browse our current job openings and submit your application online.
        </Typography>
      </Box>

      {jobs.length === 0 ? (
        <Typography color="text.secondary">No open positions right now. Please check back later.</Typography>
      ) : (
        <Stack spacing={2}>
          {jobs.map((job) => (
            <Card key={job.id} variant="outlined">
              <CardActionArea component={NavLink} href={`/jobs/${job.id}`}>
                <CardContent>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {job.department && <span>{job.department} · </span>}
                    {job.location && <span>{job.location} · </span>}
                    {employmentTypeLabel[job.employmentType]}
                  </Typography>
                  {job.salaryRange && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {job.salaryRange}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}

      <Box component="footer" sx={{ mt: 8 }}>
        <Stack direction="row" spacing={3}>
          <Link href="/login" style={{ fontSize: 14, color: "var(--mui-palette-text-secondary)" }}>
            Staff login
          </Link>
          <Link href="/register" style={{ fontSize: 14, color: "var(--mui-palette-text-secondary)" }}>
            Create account
          </Link>
        </Stack>
      </Box>
    </Container>
  );
}
