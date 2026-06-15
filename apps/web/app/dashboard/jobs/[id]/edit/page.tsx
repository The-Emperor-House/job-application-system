import Typography from "@mui/material/Typography";
import JobForm from "@/components/JobForm";
import { authApi } from "@/lib/api";
import { JobPosting } from "@/lib/types";
import { updateJobAction } from "../../actions";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await authApi<JobPosting>(`/api/jobs/${id}`);
  const action = updateJobAction.bind(null, job.id);

  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Edit Job Posting
      </Typography>
      <JobForm action={action} job={job} />
    </div>
  );
}
