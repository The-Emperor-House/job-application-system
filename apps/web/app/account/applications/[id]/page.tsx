import Link from "next/link";
import NavLink from "@/components/NavLink";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { authApi, ApiError } from "@/lib/api";
import { JobApplication } from "@/lib/types";

const languageLevelLabel: Record<string, string> = {
  NONE: "-",
  BASIC: "Basic",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  FLUENT: "Fluent",
};

export default async function MyApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div>
      <Link href="/account/applications" style={{ fontSize: 14, color: "var(--mui-palette-text-secondary)" }}>
        ← Back to my applications
      </Link>

      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mt: 2, mb: 4 }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {app.jobPosting?.title}
          </Typography>
          <Typography color="text.secondary">Applied on {new Date(app.createdAt).toLocaleDateString()}</Typography>
        </div>
        <Chip label={app.status} color={app.status === "RETURNED" ? "warning" : "primary"} />
      </Box>

      {app.status === "RETURNED" && (
        <Alert
          severity="warning"
          sx={{ mb: 4 }}
          action={
            <Button component={NavLink} href={`/account/applications/${app.id}/edit`} color="inherit" size="small">
              Edit & resubmit
            </Button>
          }
        >
          This application was returned for revision.
          {app.notes?.length ? ` Feedback: ${app.notes[0].note}` : " Please review and update the details below."}
        </Alert>
      )}

      <Stack spacing={4}>
        <Section title="Personal Information">
          <Grid container spacing={1.5}>
            <Item label="Email" value={app.email} />
            <Item label="Phone" value={app.phone} />
            <Item label="Birth date" value={app.birthDate ? new Date(app.birthDate).toLocaleDateString() : "-"} />
            <Item label="Expected salary" value={app.expectedSalary ?? "-"} />
            <Item
              label="Available start date"
              value={app.availableStartDate ? new Date(app.availableStartDate).toLocaleDateString() : "-"}
            />
            <Item label="Address" value={app.address ?? "-"} fullWidth />
          </Grid>
        </Section>

        <Section title="Education">
          {app.education?.length ? (
            <Stack spacing={1}>
              {app.education.map((e) => (
                <Paper key={e.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography sx={{ fontWeight: 500 }} variant="body2">
                    {e.level} - {e.institution}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {e.major} {e.graduationYear && `· Graduated ${e.graduationYear}`} {e.gpa && `· GPA ${e.gpa}`}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <EmptyText />
          )}
        </Section>

        <Section title="Work Experience">
          {app.experience?.length ? (
            <Stack spacing={1}>
              {app.experience.map((e) => (
                <Paper key={e.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography sx={{ fontWeight: 500 }} variant="body2">
                    {e.position} - {e.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {e.startDate ? new Date(e.startDate).toLocaleDateString() : "?"} -{" "}
                    {e.endDate ? new Date(e.endDate).toLocaleDateString() : "Present"}
                  </Typography>
                  {e.responsibilities && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {e.responsibilities}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Stack>
          ) : (
            <EmptyText />
          )}
        </Section>

        <Section title="Languages">
          {app.languages?.length ? (
            <Stack spacing={1}>
              {app.languages.map((l) => (
                <Paper key={l.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography sx={{ fontWeight: 500 }} variant="body2">
                    {l.language}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Listening: {languageLevelLabel[l.listening]} · Speaking: {languageLevelLabel[l.speaking]} · Reading:{" "}
                    {languageLevelLabel[l.reading]} · Writing: {languageLevelLabel[l.writing]}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <EmptyText />
          )}
        </Section>

        <Section title="References">
          {app.references?.length ? (
            <Stack spacing={1}>
              {app.references.map((r) => (
                <Paper key={r.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography sx={{ fontWeight: 500 }} variant="body2">
                    {r.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.relationship} {r.company && `· ${r.company}`} {r.phone && `· ${r.phone}`}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <EmptyText />
          )}
        </Section>

        <Section title="Attachments">
          {app.attachments?.length ? (
            <Stack spacing={0.5}>
              {app.attachments.map((a) => (
                <Link key={a.id} href={a.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "var(--mui-palette-primary-main)" }}>
                  {a.fileName}
                </Link>
              ))}
            </Stack>
          ) : (
            <EmptyText />
          )}
        </Section>
      </Stack>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box component="section">
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Item({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <Grid size={fullWidth ? 12 : 6}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Grid>
  );
}

function EmptyText() {
  return (
    <Typography variant="body2" color="text.disabled">
      None provided
    </Typography>
  );
}
