import bcrypt from "bcryptjs";
import { DocumentCategory, UserRole } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../middlewares/errorHandler";
import { uploadBufferToCloudinary } from "../../config/cloudinary";

const profileSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  phone: true,
  address: true,
  avatarUrl: true,
  emailVerified: true,
  isActive: true,
  createdAt: true,
} as const;

export async function getProfile(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: profileSelect });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return user;
}

export async function updateProfile(
  userId: number,
  data: { name?: string; phone?: string; address?: string }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: profileSelect,
  });
  return user;
}

export async function uploadAvatar(userId: number, file: Express.Multer.File) {
  const { url } = await uploadBufferToCloudinary(file.buffer, "users/avatars", "image");
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: url },
    select: profileSelect,
  });
}

export async function listDocuments(userId: number) {
  return prisma.userDocument.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
  });
}

export async function addDocument(
  userId: number,
  file: Express.Multer.File,
  category: DocumentCategory = DocumentCategory.OTHER
) {
  const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";
  const { url } = await uploadBufferToCloudinary(file.buffer, "users/documents", resourceType, file.originalname);
  return prisma.userDocument.create({
    data: {
      userId,
      category,
      fileName: file.originalname,
      fileUrl: url,
      fileType: file.mimetype,
    },
  });
}

export async function deleteDocument(userId: number, documentId: number) {
  const document = await prisma.userDocument.findUnique({ where: { id: documentId } });
  if (!document || document.userId !== userId) {
    throw new HttpError(404, "Document not found");
  }
  await prisma.userDocument.delete({ where: { id: documentId } });
  return { ok: true };
}

export async function listUsers(filter: { role?: UserRole }) {
  return prisma.user.findMany({
    where: { role: filter.role },
    select: profileSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(id: number, role: UserRole) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return prisma.user.update({ where: { id }, data: { role }, select: profileSelect });
}

export async function updateUserActive(id: number, isActive: boolean) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  return prisma.user.update({ where: { id }, data: { isActive }, select: profileSelect });
}

export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw new HttpError(400, "Current password is incorrect");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return { ok: true };
}

export async function resetUserPassword(id: number, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id }, data: { passwordHash } });
  return { ok: true };
}
