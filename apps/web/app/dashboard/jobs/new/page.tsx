import Typography from "@mui/material/Typography";
import JobForm from "@/components/JobForm";
import { createJobAction } from "../actions";

export default function NewJobPage() {
  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        เพิ่มตำแหน่งงานใหม่
      </Typography>
      <JobForm action={createJobAction} />
    </div>
  );
}
