"use server";

import { revalidatePath } from "next/cache";
import { authApi } from "@/lib/api";

export interface ProfileFormState {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    await authApi("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        name: formData.get("name") as string,
        phone: (formData.get("phone") as string) || undefined,
        address: (formData.get("address") as string) || undefined,
      }),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update profile" };
  }

  revalidatePath("/account");
  revalidatePath("/account/profile");
  return { success: true };
}

export async function deleteDocumentAction(documentId: number) {
  await authApi(`/api/users/me/documents/${documentId}`, { method: "DELETE" });
  revalidatePath("/account/documents");
}
