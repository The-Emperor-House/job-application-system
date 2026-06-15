"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authApi, ApiError } from "@/lib/api";

export interface JobFormState {
  error?: string;
}

function jobPayloadFromFormData(formData: FormData) {
  const closingDate = formData.get("closingDate") as string;
  return {
    title: formData.get("title") as string,
    department: (formData.get("department") as string) || undefined,
    description: formData.get("description") as string,
    requirements: (formData.get("requirements") as string) || undefined,
    location: (formData.get("location") as string) || undefined,
    employmentType: formData.get("employmentType") as string,
    salaryRange: (formData.get("salaryRange") as string) || undefined,
    status: formData.get("status") as string,
    closingDate: closingDate || undefined,
  };
}

export async function createJobAction(_prevState: JobFormState, formData: FormData): Promise<JobFormState> {
  try {
    await authApi("/api/jobs", {
      method: "POST",
      body: JSON.stringify(jobPayloadFromFormData(formData)),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create job" };
  }

  revalidatePath("/dashboard/jobs");
  redirect("/dashboard/jobs");
}

export async function updateJobAction(
  jobId: number,
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  try {
    await authApi(`/api/jobs/${jobId}`, {
      method: "PATCH",
      body: JSON.stringify(jobPayloadFromFormData(formData)),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update job" };
  }

  revalidatePath("/dashboard/jobs");
  redirect("/dashboard/jobs");
}

export async function deleteJobAction(jobId: number): Promise<JobFormState> {
  try {
    await authApi(`/api/jobs/${jobId}`, { method: "DELETE" });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to delete job posting" };
  }

  revalidatePath("/dashboard/jobs");
  return {};
}

export async function setJobStatusAction(jobId: number, status: "OPEN" | "CLOSED"): Promise<JobFormState> {
  try {
    await authApi(`/api/jobs/${jobId}`, { method: "PATCH", body: JSON.stringify({ status }) });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Failed to update job posting" };
  }

  revalidatePath("/dashboard/jobs");
  return {};
}
