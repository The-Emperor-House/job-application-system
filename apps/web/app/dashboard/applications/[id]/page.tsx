import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { authApi } from "@/lib/api";
import { JobApplication } from "@/lib/types";
import StatusSelector from "../StatusSelector";
import NoteForm from "../NoteForm";

const languageLevelLabel: Record<string, string> = {
  NONE: "-",
  BASIC: "Basic",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  FLUENT: "Fluent",
};

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await authApi<JobApplication>(`/api/applications/${id}`);

  return (
    <div>
      <Link href="/dashboard/applications" style={{ fontSize: 14, color: "var(--mui-palette-text-secondary)" }}>
        ← Back to applications
      </Link>

      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mt: 2, mb: 4 }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {app.fullName}
          </Typography>
          <Typography color="text.secondary">
            Applied for <Box component="span" sx={{ fontWeight: 500 }}>{app.jobPosting?.title}</Box> on{" "}
            {new Date(app.createdAt).toLocaleDateString()}
          </Typography>
        </div>
        <StatusSelector applicationId={app.id} status={app.status} />
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
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
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={4}>
            <Section title="Photo">
              {app.photoUrl ? (
                <Box
                  component="img"
                  src={app.photoUrl}
                  alt={app.fullName}
                  sx={{ borderRadius: 1, border: 1, borderColor: "divider", width: "100%", objectFit: "cover" }}
                />
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

            <Section title="Internal Notes">
              <Stack spacing={1.5} sx={{ mb: 2 }}>
                {app.notes?.length ? (
                  app.notes.map((n) => (
                    <Paper key={n.id} variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="body2">{n.note}</Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.5 }}>
                        {n.user.name} · {new Date(n.createdAt).toLocaleString()}
                      </Typography>
                    </Paper>
                  ))
                ) : (
                  <EmptyText />
                )}
              </Stack>
              <NoteForm applicationId={app.id} />
            </Section>
          </Stack>
        </Grid>
      </Grid>
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
