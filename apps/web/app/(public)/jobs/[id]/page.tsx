import Link from "next/link";
import NavLink from "@/components/NavLink";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { publicApi, ApiError } from "@/lib/api";
import { JobPosting } from "@/lib/types";

const employmentTypeLabel: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let job: JobPosting;
  try {
    job = await publicApi<JobPosting>(`/api/jobs/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ flex: 1, py: 6 }}>
      <Link href="/" style={{ fontSize: 14, color: "var(--mui-palette-text-secondary)" }}>
        ← Back to all positions
      </Link>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 2 }}>
        {job.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        {job.department && <span>{job.department} · </span>}
        {job.location && <span>{job.location} · </span>}
        {employmentTypeLabel[job.employmentType]}
      </Typography>
      {job.salaryRange && (
        <Typography sx={{ mt: 1 }}>{job.salaryRange}</Typography>
      )}

      <Box component="section" sx={{ mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
          Job Description
        </Typography>
        <Typography sx={{ whiteSpace: "pre-line" }}>{job.description}</Typography>
      </Box>

      {job.requirements && (
        <Box component="section" sx={{ mt: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            Requirements
          </Typography>
          <Typography sx={{ whiteSpace: "pre-line" }}>{job.requirements}</Typography>
        </Box>
      )}

      {job.status === "OPEN" && (!job.closingDate || new Date(job.closingDate) >= new Date()) ? (
        <Button component={NavLink} href={`/jobs/${job.id}/apply`} variant="contained" size="large" sx={{ mt: 5 }}>
          Apply now
        </Button>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 5 }}>
          This position is no longer accepting applications.
        </Typography>
      )}
    </Container>
  );
}
