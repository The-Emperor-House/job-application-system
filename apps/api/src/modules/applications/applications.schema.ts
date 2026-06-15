import { z } from "zod";

const applicationStatus = z.enum(["PENDING", "REVIEWING", "INTERVIEW", "OFFERED", "REJECTED", "HIRED", "RETURNED"]);

const languageLevel = z.enum(["NONE", "BASIC", "INTERMEDIATE", "ADVANCED", "FLUENT"]);

const educationSchema = z.object({
  level: z.string().min(1),
  institution: z.string().min(1),
  major: z.string().optional(),
  graduationYear: z.string().optional(),
  gpa: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  responsibilities: z.string().optional(),
});

const languageSchema = z.object({
  language: z.string().min(1),
  listening: languageLevel.optional(),
  speaking: languageLevel.optional(),
  reading: languageLevel.optional(),
  writing: languageLevel.optional(),
});

const referenceSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
});

export const createApplicationSchema = z.object({
  jobPostingId: z.coerce.number().int().positive(),
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  expectedSalary: z.string().optional(),
  availableStartDate: z.string().optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  languages: z.array(languageSchema).optional(),
  references: z.array(referenceSchema).optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export const updateApplicationSchema = createApplicationSchema.omit({ jobPostingId: true });

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

export const updateStatusSchema = z.object({
  status: applicationStatus,
});

export const addNoteSchema = z.object({
  note: z.string().min(1),
});

export const listApplicationsQuerySchema = z.object({
  jobPostingId: z.coerce.number().int().positive().optional(),
  status: applicationStatus.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
