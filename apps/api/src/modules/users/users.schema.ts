import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "ADMIN", "HR", "APPLICANT"]),
});

export const updateActiveSchema = z.object({
  isActive: z.boolean(),
});

export const addDocumentSchema = z.object({
  category: z.enum(["RESUME", "PORTFOLIO", "CERTIFICATE", "OTHER"]).optional(),
});

export const listUsersQuerySchema = z.object({
  role: z.enum(["SUPER_ADMIN", "ADMIN", "HR", "APPLICANT"]).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8),
});
