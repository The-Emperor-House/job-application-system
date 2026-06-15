import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { publicApi, authApi, ApiError } from "@/lib/api";
import { JobPosting, AuthUser } from "@/lib/types";
import ApplicationForm from "@/components/ApplicationForm";

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
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

  let profile: AuthUser;
  try {
    profile = await authApi<AuthUser>("/api/users/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect(`/login?from=/jobs/${id}/apply`);
    }
    throw err;
  }

  if (profile.role !== "APPLICANT") {
    redirect(`/jobs/${id}`);
  }

  const isOpen = job.status === "OPEN" && (!job.closingDate || new Date(job.closingDate) >= new Date());
  if (!isOpen) {
    redirect(`/jobs/${id}`);
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ flex: 1, py: 6 }}>
      <Link href={`/jobs/${job.id}`} style={{ fontSize: 14, color: "var(--mui-palette-text-secondary)" }}>
        ← Back to job details
      </Link>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 2, mb: 0.5 }}>
        Apply for {job.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Please fill out the form below. Fields marked with * are required.
      </Typography>

      <ApplicationForm jobPostingId={job.id} profile={profile} />
    </Container>
  );
}
