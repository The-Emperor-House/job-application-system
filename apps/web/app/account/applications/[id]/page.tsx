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
import { applicationStatusLabel, languageLevelLabel } from "@/lib/labels";

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
        ← กลับไปยังใบสมัครของฉัน
      </Link>

      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mt: 2, mb: 4 }}>
        <div>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {app.jobPosting?.title}
          </Typography>
          <Typography color="text.secondary">สมัครเมื่อ {new Date(app.createdAt).toLocaleDateString("th-TH")}</Typography>
        </div>
        <Chip label={applicationStatusLabel[app.status] ?? app.status} color={app.status === "RETURNED" ? "warning" : "primary"} />
      </Box>

      {app.status === "RETURNED" && (
        <Alert
          severity="warning"
          sx={{ mb: 4 }}
          action={
            <Button component={NavLink} href={`/account/applications/${app.id}/edit`} color="inherit" size="small">
              แก้ไขและส่งใหม่
            </Button>
          }
        >
          ใบสมัครนี้ถูกตีกลับเพื่อให้แก้ไข
          {app.notes?.length ? ` ข้อเสนอแนะ: ${app.notes[0].note}` : " กรุณาตรวจสอบและแก้ไขข้อมูลด้านล่าง"}
        </Alert>
      )}

      <Stack spacing={4}>
        <Section title="ข้อมูลส่วนตัว">
          <Grid container spacing={1.5}>
            <Item label="อีเมล" value={app.email} />
            <Item label="เบอร์โทรศัพท์" value={app.phone} />
            <Item label="วันเกิด" value={app.birthDate ? new Date(app.birthDate).toLocaleDateString("th-TH") : "-"} />
            <Item label="เงินเดือนที่คาดหวัง" value={app.expectedSalary ?? "-"} />
            <Item
              label="วันที่พร้อมเริ่มงาน"
              value={app.availableStartDate ? new Date(app.availableStartDate).toLocaleDateString("th-TH") : "-"}
            />
            <Item label="ที่อยู่" value={app.address ?? "-"} fullWidth />
          </Grid>
        </Section>

        <Section title="การศึกษา">
          {app.education?.length ? (
            <Stack spacing={1}>
              {app.education.map((e) => (
                <Paper key={e.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography sx={{ fontWeight: 500 }} variant="body2">
                    {e.level} - {e.institution}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {e.major} {e.graduationYear && `· จบการศึกษาปี ${e.graduationYear}`} {e.gpa && `· เกรดเฉลี่ย ${e.gpa}`}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <EmptyText />
          )}
        </Section>

        <Section title="ประสบการณ์ทำงาน">
          {app.experience?.length ? (
            <Stack spacing={1}>
              {app.experience.map((e) => (
                <Paper key={e.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography sx={{ fontWeight: 500 }} variant="body2">
                    {e.position} - {e.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {e.startDate ? new Date(e.startDate).toLocaleDateString("th-TH") : "?"} -{" "}
                    {e.endDate ? new Date(e.endDate).toLocaleDateString("th-TH") : "ปัจจุบัน"}
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

        <Section title="ภาษา">
          {app.languages?.length ? (
            <Stack spacing={1}>
              {app.languages.map((l) => (
                <Paper key={l.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography sx={{ fontWeight: 500 }} variant="body2">
                    {l.language}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ฟัง: {languageLevelLabel[l.listening]} · พูด: {languageLevelLabel[l.speaking]} · อ่าน:{" "}
                    {languageLevelLabel[l.reading]} · เขียน: {languageLevelLabel[l.writing]}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <EmptyText />
          )}
        </Section>

        <Section title="ผู้รับรอง">
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

        <Section title="เอกสารแนบ">
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
      ไม่มีข้อมูล
    </Typography>
  );
}
