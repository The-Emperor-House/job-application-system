"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authApi } from "@/lib/api";

export interface NoteFormState {
  error?: string;
}

export async function updateStatusAction(applicationId: number, status: string) {
  await authApi(`/api/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath("/dashboard/applications");
}

export async function deleteApplicationAction(applicationId: number) {
  await authApi(`/api/applications/${applicationId}`, { method: "DELETE" });
  revalidatePath("/dashboard/applications");
  redirect("/dashboard/applications");
}

export async function addNoteAction(
  applicationId: number,
  _prevState: NoteFormState,
  formData: FormData
): Promise<NoteFormState> {
  const note = formData.get("note") as string;
  if (!note?.trim()) {
    return { error: "Note cannot be empty" };
  }

  try {
    await authApi(`/api/applications/${applicationId}/notes`, {
      method: "POST",
      body: JSON.stringify({ note }),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to add note" };
  }

  revalidatePath(`/dashboard/applications/${applicationId}`);
  return {};
}
