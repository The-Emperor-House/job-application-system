import { prisma } from "../../config/prisma";
import { HttpError } from "../../middlewares/errorHandler";
import { JobStatus } from "@prisma/client";

export async function listOpenJobs() {
  return prisma.jobPosting.findMany({
    where: { status: JobStatus.OPEN },
    orderBy: { createdAt: "desc" },
  });
}

export async function listAllJobs() {
  return prisma.jobPosting.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });
}

export async function getJobById(id: number) {
  const job = await prisma.jobPosting.findUnique({ where: { id } });
  if (!job) {
    throw new HttpError(404, "Job posting not found");
  }
  return job;
}

export interface JobInput {
  title: string;
  department?: string;
  description: string;
  requirements?: string;
  location?: string;
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  salaryRange?: string;
  status?: "OPEN" | "CLOSED";
  closingDate?: string;
}

export async function createJob(data: JobInput) {
  return prisma.jobPosting.create({
    data: {
      ...data,
      closingDate: data.closingDate ? new Date(data.closingDate) : undefined,
    },
  });
}

export async function updateJob(id: number, data: Partial<JobInput>) {
  await getJobById(id);
  return prisma.jobPosting.update({
    where: { id },
    data: {
      ...data,
      closingDate: data.closingDate ? new Date(data.closingDate) : undefined,
    },
  });
}

export async function deleteJob(id: number) {
  await getJobById(id);
  await prisma.jobPosting.delete({ where: { id } });
}
