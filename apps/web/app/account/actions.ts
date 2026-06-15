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
    return { error: err instanceof Error ? err.message : "อัปเดตข้อมูลส่วนตัวไม่สำเร็จ" };
  }

  revalidatePath("/account");
  revalidatePath("/account/profile");
  return { success: true };
}

export async function deleteDocumentAction(documentId: number) {
  await authApi(`/api/users/me/documents/${documentId}`, { method: "DELETE" });
  revalidatePath("/account/documents");
}

export interface ChangePasswordFormState {
  error?: string;
  success?: boolean;
}

export async function changePasswordAction(
  _prevState: ChangePasswordFormState,
  formData: FormData
): Promise<ChangePasswordFormState> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "รหัสผ่านใหม่และการยืนยันไม่ตรงกัน" };
  }

  try {
    await authApi("/api/users/me/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "เปลี่ยนรหัสผ่านไม่สำเร็จ" };
  }

  return { success: true };
}
