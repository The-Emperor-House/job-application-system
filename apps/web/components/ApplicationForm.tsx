"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { AuthUser, JobApplication } from "@/lib/types";

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

  function updateRow<T>(rows: T[], setRows: (rows: T[]) => void, index: number, field: keyof T, value: string) {
    const next = [...rows];
    next[index] = { ...next[index], [field]: value };
    setRows(next);
  }

  function validate(): string | null {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      return "Please fill in your name, email, and phone number.";
    }

    const hasEducation = education.some((row) => row.level.trim() && row.institution.trim());
    if (!hasEducation) {
      return "Please add at least one education entry.";
    }

    if (!resume && !application?.attachments?.length) {
      return "Please upload your resume.";
    }

    return null;
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
        throw new Error(body.message ?? "Failed to submit application");
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
          throw new Error(body.message ?? "Failed to upload files");
        }
      }

      router.push(application ? `/account/applications/${saved.id}` : "/apply/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={5}>
      <Box component="section">
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Full name" required fullWidth size="small" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Email" type="email" required fullWidth size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Phone" required fullWidth size="small" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Birth date"
              type="date"
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="Expected salary" fullWidth size="small" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Available start date"
              type="date"
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              value={availableStartDate}
              onChange={(e) => setAvailableStartDate(e.target.value)}
            />
          </Grid>
          <Grid size={12}>
            <TextField label="Address" fullWidth size="small" multiline minRows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
          </Grid>
        </Grid>
      </Box>

      <Box component="section">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Education
          </Typography>
          <AddButton onClick={() => setEducation([...education, { ...emptyEducation }])} />
        </Box>
        <Stack spacing={1.5}>
          {education.map((row, i) => (
            <Row key={i} onRemove={() => setEducation(education.filter((_, idx) => idx !== i))} canRemove={education.length > 1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Level" placeholder="e.g. Bachelor's" fullWidth size="small" value={row.level} onChange={(e) => updateRow(education, setEducation, i, "level", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Institution" fullWidth size="small" value={row.institution} onChange={(e) => updateRow(education, setEducation, i, "institution", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Major" fullWidth size="small" value={row.major} onChange={(e) => updateRow(education, setEducation, i, "major", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Graduation year" fullWidth size="small" value={row.graduationYear} onChange={(e) => updateRow(education, setEducation, i, "graduationYear", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="GPA" fullWidth size="small" value={row.gpa} onChange={(e) => updateRow(education, setEducation, i, "gpa", e.target.value)} />
              </Grid>
            </Row>
          ))}
        </Stack>
      </Box>

      <Box component="section">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Work Experience
          </Typography>
          <AddButton onClick={() => setExperience([...experience, { ...emptyExperience }])} />
        </Box>
        <Stack spacing={1.5}>
          {experience.map((row, i) => (
            <Row key={i} onRemove={() => setExperience(experience.filter((_, idx) => idx !== i))} canRemove={experience.length > 1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Company" fullWidth size="small" value={row.company} onChange={(e) => updateRow(experience, setExperience, i, "company", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Position" fullWidth size="small" value={row.position} onChange={(e) => updateRow(experience, setExperience, i, "position", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Start date"
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
                  label="End date"
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
                  label="Responsibilities"
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
            Languages
          </Typography>
          <AddButton onClick={() => setLanguages([...languages, { ...emptyLanguage }])} />
        </Box>
        <Stack spacing={1.5}>
          {languages.map((row, i) => (
            <Row key={i} onRemove={() => setLanguages(languages.filter((_, idx) => idx !== i))} canRemove={languages.length > 1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Language" fullWidth size="small" value={row.language} onChange={(e) => updateRow(languages, setLanguages, i, "language", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField select label="Listening" fullWidth size="small" value={row.listening} onChange={(e) => updateRow(languages, setLanguages, i, "listening", e.target.value)}>
                  {languageLevels.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField select label="Speaking" fullWidth size="small" value={row.speaking} onChange={(e) => updateRow(languages, setLanguages, i, "speaking", e.target.value)}>
                  {languageLevels.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField select label="Reading" fullWidth size="small" value={row.reading} onChange={(e) => updateRow(languages, setLanguages, i, "reading", e.target.value)}>
                  {languageLevels.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField select label="Writing" fullWidth size="small" value={row.writing} onChange={(e) => updateRow(languages, setLanguages, i, "writing", e.target.value)}>
                  {languageLevels.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
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
            References
          </Typography>
          <AddButton onClick={() => setReferences([...references, { ...emptyReference }])} />
        </Box>
        <Stack spacing={1.5}>
          {references.map((row, i) => (
            <Row key={i} onRemove={() => setReferences(references.filter((_, idx) => idx !== i))} canRemove={references.length > 1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Name" fullWidth size="small" value={row.name} onChange={(e) => updateRow(references, setReferences, i, "name", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Relationship" fullWidth size="small" value={row.relationship} onChange={(e) => updateRow(references, setReferences, i, "relationship", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Phone" fullWidth size="small" value={row.phone} onChange={(e) => updateRow(references, setReferences, i, "phone", e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Company" fullWidth size="small" value={row.company} onChange={(e) => updateRow(references, setReferences, i, "company", e.target.value)} />
              </Grid>
            </Row>
          ))}
        </Stack>
      </Box>

      <Box component="section">
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Attachments
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button variant="outlined" component="label" fullWidth>
              {resume ? resume.name : "Upload resume (PDF or Word)"}
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
              {photo ? photo.name : "Upload photo (JPG, PNG, or WEBP)"}
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
        {submitting ? "Submitting..." : application ? "Resubmit application" : "Submit application"}
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
          Remove
        </Button>
      )}
    </Paper>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" onClick={onClick} size="small">
      + Add row
    </Button>
  );
}
