import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Typography from "@mui/material/Typography";
import { authApi, ApiError } from "@/lib/api";
import { JobApplication } from "@/lib/types";
import ApplicationForm from "@/components/ApplicationForm";

export default async function EditApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let app: JobApplication;
  try {
    app = await authApi<JobApplication>(`/api/applications/my/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  if (app.status !== "RETURNED") {
    redirect(`/account/applications/${id}`);
  }

  return (
    <div>
      <Link href={`/account/applications/${id}`} style={{ fontSize: 14, color: "var(--mui-palette-text-secondary)" }}>
        ← Back to application
      </Link>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 2, mb: 0.5 }}>
        Update your application
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        This application was returned for revision. Please update the details below and resubmit.
      </Typography>

      <ApplicationForm jobPostingId={app.jobPostingId} application={app} />
    </div>
  );
}
