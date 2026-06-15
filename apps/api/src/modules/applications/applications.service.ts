import { prisma } from "../../config/prisma";
import { HttpError } from "../../middlewares/errorHandler";
import { uploadBufferToCloudinary } from "../../config/cloudinary";
import { ApplicationStatus, LanguageLevel } from "@prisma/client";
import { CreateApplicationInput } from "./applications.schema";

export async function createApplication(input: CreateApplicationInput, userId: number) {
  const job = await prisma.jobPosting.findUnique({ where: { id: input.jobPostingId } });
  if (!job) {
    throw new HttpError(404, "Job posting not found");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const fullName = input.fullName ?? user.name;
  const email = input.email ?? user.email;
  const phone = input.phone ?? user.phone;

  if (!phone) {
    throw new HttpError(400, "Phone number is required");
  }

  return prisma.jobApplication.create({
    data: {
      jobPostingId: input.jobPostingId,
      userId,
      fullName,
      email,
      phone,
      birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
      address: input.address ?? user.address ?? undefined,
      expectedSalary: input.expectedSalary,
      availableStartDate: input.availableStartDate ? new Date(input.availableStartDate) : undefined,
      education: { create: input.education ?? [] },
      experience: {
        create: (input.experience ?? []).map((exp) => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate) : undefined,
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
        })),
      },
      languages: {
        create: (input.languages ?? []).map((lang) => ({
          language: lang.language,
          listening: (lang.listening ?? "NONE") as LanguageLevel,
          speaking: (lang.speaking ?? "NONE") as LanguageLevel,
          reading: (lang.reading ?? "NONE") as LanguageLevel,
          writing: (lang.writing ?? "NONE") as LanguageLevel,
        })),
      },
      references: { create: input.references ?? [] },
    },
    include: { education: true, experience: true, languages: true, references: true },
  });
}

export async function uploadAttachments(
  applicationId: number,
  files: { resume?: Express.Multer.File[]; photo?: Express.Multer.File[] },
  userId: number
) {
  const application = await prisma.jobApplication.findUnique({ where: { id: applicationId } });
  if (!application) {
    throw new HttpError(404, "Application not found");
  }

  if (application.userId !== userId) {
    throw new HttpError(403, "You do not have access to this application");
  }

  if (files.resume?.[0]) {
    const file = files.resume[0];
    const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";
    const { url } = await uploadBufferToCloudinary(file.buffer, "job-applications/resumes", resourceType, file.originalname);
    await prisma.applicationAttachment.create({
      data: {
        applicationId,
        fileName: file.originalname,
        fileUrl: url,
        fileType: "resume",
      },
    });
  }

  if (files.photo?.[0]) {
    const file = files.photo[0];
    const { url } = await uploadBufferToCloudinary(file.buffer, "job-applications/photos", "image");
    await prisma.jobApplication.update({ where: { id: applicationId }, data: { photoUrl: url } });
  }

  return getApplicationById(applicationId);
}

export interface ListApplicationsFilter {
  jobPostingId?: number;
  status?: ApplicationStatus;
}

export async function listApplications(filter: ListApplicationsFilter) {
  return prisma.jobApplication.findMany({
    where: {
      jobPostingId: filter.jobPostingId,
      status: filter.status,
    },
    include: { jobPosting: { select: { id: true, title: true } }, attachments: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listMyApplications(userId: number) {
  return prisma.jobApplication.findMany({
    where: { userId },
    include: { jobPosting: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyApplicationById(userId: number, id: number) {
  const application = await getApplicationById(id);
  if (application.userId !== userId) {
    throw new HttpError(404, "Application not found");
  }
  return application;
}

export async function getApplicationById(id: number) {
  const application = await prisma.jobApplication.findUnique({
    where: { id },
    include: {
      jobPosting: true,
      education: true,
      experience: true,
      languages: true,
      references: true,
      attachments: true,
      notes: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          documents: { orderBy: { uploadedAt: "desc" } },
        },
      },
    },
  });

  if (!application) {
    throw new HttpError(404, "Application not found");
  }
  return application;
}

export async function updateApplicationStatus(id: number, status: ApplicationStatus) {
  await getApplicationById(id);
  return prisma.jobApplication.update({ where: { id }, data: { status } });
}

export async function addApplicationNote(applicationId: number, userId: number, note: string) {
  await getApplicationById(applicationId);
  return prisma.applicationNote.create({
    data: { applicationId, userId, note },
    include: { user: { select: { id: true, name: true } } },
  });
}
