"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { AuthUser, ApplicationAttachment, JobApplication } from "@/lib/types";
import { languageLevelLabel } from "@/lib/labels";

interface EducationRow {
  level: string;
  institution: string;
  major: string;
  graduationYear: string;
  gpa: string;
}

interface ExperienceRow {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

interface LanguageRow {
  language: string;
  listening: string;
  speaking: string;
  reading: string;
  writing: string;
}

interface ReferenceRow {
  name: string;
  relationship: string;
  phone: string;
  company: string;
}

const emptyEducation: EducationRow = { level: "", institution: "", major: "", graduationYear: "", gpa: "" };
const emptyExperience: ExperienceRow = { company: "", position: "", startDate: "", endDate: "", responsibilities: "" };
const emptyLanguage: LanguageRow = { language: "", listening: "NONE", speaking: "NONE", reading: "NONE", writing: "NONE" };
const emptyReference: ReferenceRow = { name: "", relationship: "", phone: "", company: "" };

const languageLevels = ["NONE", "BASIC", "INTERMEDIATE", "ADVANCED", "FLUENT"];

/** Converts an ISO date string to the yyyy-MM-dd format expected by <input type="date">. */
function toDateInputValue(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

export default function ApplicationForm({
  jobPostingId,
  profile,
  application,
}: {
  jobPostingId: number;
  profile?: AuthUser;
  application?: JobApplication;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(application?.fullName ?? profile?.name ?? "");
  const [email, setEmail] = useState(application?.email ?? profile?.email ?? "");
  const [phone, setPhone] = useState(application?.phone ?? profile?.phone ?? "");
  const [birthDate, setBirthDate] = useState(toDateInputValue(application?.birthDate));
  const [address, setAddress] = useState(application?.address ?? profile?.address ?? "");
  const [expectedSalary, setExpectedSalary] = useState(application?.expectedSalary ?? "");
  const [availableStartDate, setAvailableStartDate] = useState(toDateInputValue(application?.availableStartDate));

  const [education, setEducation] = useState<EducationRow[]>(
    application?.education?.length
      ? application.education.map((e) => ({
          level: e.level,
          institution: e.institution,
          major: e.major ?? "",
          graduationYear: e.graduationYear ?? "",
          gpa: e.gpa ?? "",
        }))
      : [{ ...emptyEducation }]
  );
  const [experience, setExperience] = useState<ExperienceRow[]>(
    application?.experience?.length
      ? application.experience.map((e) => ({
          company: e.company,
          position: e.position,
          startDate: toDateInputValue(e.startDate),
          endDate: toDateInputValue(e.endDate),
          responsibilities: e.responsibilities ?? "",
        }))
      : [{ ...emptyExperience }]
  );
  const [languages, setLanguages] = useState<LanguageRow[]>(
    application?.languages?.length
      ? application.languages.map((l) => ({
          language: l.language,
          listening: l.listening,
          speaking: l.speaking,
          reading: l.reading,
          writing: l.writing,
        }))
      : [{ ...emptyLanguage }]
  );
  const [references, setReferences] = useState<ReferenceRow[]>(
    application?.references?.length
      ? application.references.map((r) => ({
          name: r.name,
          relationship: r.relationship ?? "",
          phone: r.phone ?? "",
          company: r.company ?? "",
        }))
      : [{ ...emptyReference }]
  );

  const [resume, setResume] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [existingAttachments, setExistingAttachments] = useState<ApplicationAttachment[]>(application?.attachments ?? []);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(application?.photoUrl ?? null);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState<number | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState(false);

  function updateRow<T>(rows: T[], setRows: (rows: T[]) => void, index: number, field: keyof T, value: string) {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };
    setRows(next);
  }

  function validate(): string | null {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      return "กรุณากรอกชื่อ อีเมล และเบอร์โทรศัพท์";
    }

    const hasEducation = education.some((row) => row.level.trim() && row.institution.trim());
    if (!hasEducation) {
      return "กรุณาเพิ่มข้อมูลการศึกษาอย่างน้อย 1 รายการ";
    }

    return null;
  }

  async function handleDeleteAttachment(attachmentId: number) {
    if (!application || !confirm("ลบไฟล์นี้?")) return;
    setDeletingAttachmentId(attachmentId);
    try {
      const res = await fetch(`/api/applications/my/${application.id}/attachments/${attachmentId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "ไม่สามารถลบไฟล์ได้");
      }
      setExistingAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setDeletingAttachmentId(null);
    }
  }

  async function handleDeletePhoto() {
    if (!application || !confirm("ลบรูปถ่ายนี้?")) return;
    setDeletingPhoto(true);
    try {
      const res = await fetch(`/api/applications/my/${application.id}/photo`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "ไม่สามารถลบรูปถ่ายได้");
      }
      setExistingPhotoUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setDeletingPhoto(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        fullName,
        email,
        phone,
        birthDate: birthDate || undefined,
        address: address || undefined,
        expectedSalary: expectedSalary || undefined,
        availableStartDate: availableStartDate || undefined,
        education: education.filter((row) => row.level && row.institution),
        experience: experience.filter((row) => row.company && row.position),
        languages: languages.filter((row) => row.language),
        references: references.filter((row) => row.name),
      };

      const res = application
        ? await fetch(`/api/applications/my/${application.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/applications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobPostingId, ...payload }),
          });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "ไม่สามารถส่งใบสมัครได้");
      }

      const saved = await res.json();

      if (resume || photo) {
        const formData = new FormData();
        if (resume) formData.append("resume", resume);
        if (photo) formData.append("photo", photo);

        const uploadRes = await fetch(`/api/applications/${saved.id}/attachments`, {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const body = await uploadRes.json().catch(() => ({}));
          throw new Error(body.message ?? "ไม่สามารถอัปโหลดไฟล์ได้");
        }
      }

      router.push(application ? `/account/applications/${saved.id}` : "/apply/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      setSubmitting(false);
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={5}>
      <Box component="section">
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          ข้อมูลส่วนตัว
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="ชื่อ-นามสกุล" required fullWidth size="small" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="อีเมล" type="email" required fullWidth size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="เบอร์โทรศัพท์" required fullWidth size="small" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="วันเกิด"
              type="date"
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="เงินเดือนที่คาดหวัง" fullWidth size="small" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="วันที่พร้อมเริ่มงาน"
              type="date"
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              value={availableStartDate}
              onChange={(e) => setAvailableStartDate(e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <TextField label="ที่อยู่" fullWidth size="small" multiline minRows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
          </Grid>
        </Grid>
      </Box>

      <Box component="section">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            การศึกษา
          </Typography>
          <AddButton onClick={() => setEducation([...education, { ...emptyEducation }])} />
        </Box>
        <Stack spacing={1.5}>
          {education.map((row, i) => (
            <Row key={i} onRemove={() => setEducation(education.filter((_, idx) => idx !== i))} canRemove={education.length > 1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="ระดับการศึกษา" placeholder="เช่น ปริญญาตรี" fullWidth size="small" value={row.level} onChange={(e) => updateRow(education, setEducation, i, "level", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="สถานศึกษา" fullWidth size="small" value={row.institution} onChange={(e) => updateRow(education, setEducation, i, "institution", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="สาขาวิชา" fullWidth size="small" value={row.major} onChange={(e) => updateRow(education, setEducation, i, "major", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="ปีที่จบการศึกษา" fullWidth size="small" value={row.graduationYear} onChange={(e) => updateRow(education, setEducation, i, "graduationYear", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="เกรดเฉลี่ย" fullWidth size="small" value={row.gpa} onChange={(e) => updateRow(education, setEducation, i, "gpa", e.target.value)} />
              </Grid>
            </Row>
          ))}
        </Stack>
      </Box>

      <Box component="section">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ประสบการณ์ทำงาน
          </Typography>
          <AddButton onClick={() => setExperience([...experience, { ...emptyExperience }])} />
        </Box>
        <Stack spacing={1.5}>
          {experience.map((row, i) => (
            <Row key={i} onRemove={() => setExperience(experience.filter((_, idx) => idx !== i))} canRemove={experience.length > 1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="บริษัท" fullWidth size="small" value={row.company} onChange={(e) => updateRow(experience, setExperience, i, "company", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="ตำแหน่ง" fullWidth size="small" value={row.position} onChange={(e) => updateRow(experience, setExperience, i, "position", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="วันที่เริ่มงาน"
                  type="date"
                  fullWidth
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={row.startDate}
                  onChange={(e) => updateRow(experience, setExperience, i, "startDate", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="วันที่สิ้นสุด"
                  type="date"
                  fullWidth
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={row.endDate}
                  onChange={(e) => updateRow(experience, setExperience, i, "endDate", e.target.value)}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="หน้าที่ความรับผิดชอบ"
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  value={row.responsibilities}
                  onChange={(e) => updateRow(experience, setExperience, i, "responsibilities", e.target.value)}
                />
              </Grid>
            </Row>
          ))}
        </Stack>
      </Box>

      <Box component="section">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ภาษา
          </Typography>
          <AddButton onClick={() => setLanguages([...languages, { ...emptyLanguage }])} />
        </Box>
        <Stack spacing={1.5}>
          {languages.map((row, i) => (
            <Row key={i} onRemove={() => setLanguages(languages.filter((_, idx) => idx !== i))} canRemove={languages.length > 1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="ภาษา" fullWidth size="small" value={row.language} onChange={(e) => updateRow(languages, setLanguages, i, "language", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField select label="ฟัง" fullWidth size="small" value={row.listening} onChange={(e) => updateRow(languages, setLanguages, i, "listening", e.target.value)}>
                  {languageLevels.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {languageLevelLabel[opt] ?? opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField select label="พูด" fullWidth size="small" value={row.speaking} onChange={(e) => updateRow(languages, setLanguages, i, "speaking", e.target.value)}>
                  {languageLevels.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {languageLevelLabel[opt] ?? opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField select label="อ่าน" fullWidth size="small" value={row.reading} onChange={(e) => updateRow(languages, setLanguages, i, "reading", e.target.value)}>
                  {languageLevels.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {languageLevelLabel[opt] ?? opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField select label="เขียน" fullWidth size="small" value={row.writing} onChange={(e) => updateRow(languages, setLanguages, i, "writing", e.target.value)}>
                  {languageLevels.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {languageLevelLabel[opt] ?? opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Row>
          ))}
        </Stack>
      </Box>

      <Box component="section">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            บุคคลอ้างอิง
          </Typography>
          <AddButton onClick={() => setReferences([...references, { ...emptyReference }])} />
        </Box>
        <Stack spacing={1.5}>
          {references.map((row, i) => (
            <Row key={i} onRemove={() => setReferences(references.filter((_, idx) => idx !== i))} canRemove={references.length > 1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="ชื่อ" fullWidth size="small" value={row.name} onChange={(e) => updateRow(references, setReferences, i, "name", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="ความสัมพันธ์" fullWidth size="small" value={row.relationship} onChange={(e) => updateRow(references, setReferences, i, "relationship", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="เบอร์โทรศัพท์" fullWidth size="small" value={row.phone} onChange={(e) => updateRow(references, setReferences, i, "phone", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="บริษัท/หน่วยงาน" fullWidth size="small" value={row.company} onChange={(e) => updateRow(references, setReferences, i, "company", e.target.value)} />
              </Grid>
            </Row>
          ))}
        </Stack>
      </Box>

      <Box component="section">
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          ไฟล์ที่แนบมา
        </Typography>

        {application && (existingAttachments.length > 0 || existingPhotoUrl) && (
          <Stack spacing={1} sx={{ mb: 2 }}>
            {existingAttachments.map((a) => (
              <Paper key={a.id} variant="outlined" sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href={a.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "var(--mui-palette-primary-main)" }}>
                  {a.fileName}
                </Link>
                <Button size="small" color="error" disabled={deletingAttachmentId === a.id} onClick={() => handleDeleteAttachment(a.id)}>
                  {deletingAttachmentId === a.id ? "กำลังลบ..." : "ลบ"}
                </Button>
              </Paper>
            ))}
            {existingPhotoUrl && (
              <Paper variant="outlined" sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href={existingPhotoUrl} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "var(--mui-palette-primary-main)" }}>
                  รูปถ่ายที่แนบไว้
                </Link>
                <Button size="small" color="error" disabled={deletingPhoto} onClick={handleDeletePhoto}>
                  {deletingPhoto ? "กำลังลบ..." : "ลบ"}
                </Button>
              </Paper>
            )}
          </Stack>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button variant="outlined" component="label" fullWidth>
              {resume ? resume.name : "อัปโหลดเรซูเม่ (PDF หรือ Word)"}
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
              />
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button variant="outlined" component="label" fullWidth>
              {photo ? photo.name : "อัปโหลดรูปถ่าย (JPG, PNG หรือ WEBP)"}
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Button type="submit" variant="contained" size="large" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
        {submitting ? "กำลังส่ง..." : application ? "ส่งใบสมัครใหม่อีกครั้ง" : "ส่งใบสมัคร"}
      </Button>
    </Stack>
  );
}

function Row({ children, onRemove, canRemove }: { children: React.ReactNode; onRemove: () => void; canRemove: boolean }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, position: "relative" }}>
      <Grid container spacing={2}>
        {children}
      </Grid>
      {canRemove && (
        <Button
          type="button"
          onClick={onRemove}
          size="small"
          color="error"
          sx={{ position: "absolute", top: 4, right: 4, minWidth: "auto" }}
        >
          ลบ
        </Button>
      )}
    </Paper>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" onClick={onClick} size="small">
      + เพิ่มรายการ
    </Button>
  );
}
