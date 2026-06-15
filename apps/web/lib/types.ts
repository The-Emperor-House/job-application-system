export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type JobStatus = "OPEN" | "CLOSED";
export type ApplicationStatus = "PENDING" | "REVIEWING" | "INTERVIEW" | "OFFERED" | "REJECTED" | "HIRED";
export type LanguageLevel = "NONE" | "BASIC" | "INTERMEDIATE" | "ADVANCED" | "FLUENT";
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "HR" | "APPLICANT";
export type DocumentCategory = "RESUME" | "PORTFOLIO" | "CERTIFICATE" | "OTHER";

export interface JobPosting {
  id: number;
  title: string;
  department: string | null;
  description: string;
  requirements: string | null;
  location: string | null;
  employmentType: EmploymentType;
  salaryRange: string | null;
  status: JobStatus;
  closingDate: string | null;
  createdAt: string;
  _count?: { applications: number };
}

export interface ApplicationEducation {
  id: number;
  level: string;
  institution: string;
  major: string | null;
  graduationYear: string | null;
  gpa: string | null;
}

export interface ApplicationWorkExperience {
  id: number;
  company: string;
  position: string;
  startDate: string | null;
  endDate: string | null;
  responsibilities: string | null;
}

export interface ApplicationLanguage {
  id: number;
  language: string;
  listening: LanguageLevel;
  speaking: LanguageLevel;
  reading: LanguageLevel;
  writing: LanguageLevel;
}

export interface ApplicationReference {
  id: number;
  name: string;
  relationship: string | null;
  phone: string | null;
  company: string | null;
}

export interface ApplicationAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

export interface ApplicationNote {
  id: number;
  note: string;
  createdAt: string;
  user: { id: number; name: string };
}

export interface JobApplication {
  id: number;
  jobPostingId: number;
  userId?: number | null;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string | null;
  address: string | null;
  expectedSalary: string | null;
  availableStartDate: string | null;
  photoUrl: string | null;
  status: ApplicationStatus;
  createdAt: string;
  jobPosting?: { id: number; title: string };
  education?: ApplicationEducation[];
  experience?: ApplicationWorkExperience[];
  languages?: ApplicationLanguage[];
  references?: ApplicationReference[];
  attachments?: ApplicationAttachment[];
  notes?: ApplicationNote[];
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  emailVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface UserDocument {
  id: number;
  category: DocumentCategory;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}
