import Typography from "@mui/material/Typography";
import { authApi } from "@/lib/api";
import { UserDocument } from "@/lib/types";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentList from "@/components/DocumentList";

export default async function DocumentsPage() {
  const documents = await authApi<UserDocument[]>("/api/users/me/documents");

  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        เอกสาร
      </Typography>
      <DocumentUpload />
      <DocumentList documents={documents} />
    </div>
  );
}
