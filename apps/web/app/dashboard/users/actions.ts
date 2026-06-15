"use server";

import { revalidatePath } from "next/cache";
import { authApi } from "@/lib/api";

export async function updateUserRoleAction(userId: number, role: string) {
  await authApi(`/api/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  revalidatePath("/dashboard/users");
}

export async function updateUserActiveAction(userId: number, isActive: boolean) {
  await authApi(`/api/users/${userId}/active`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
  revalidatePath("/dashboard/users");
}

export interface ResetPasswordFormState {
  error?: string;
  success?: boolean;
}

export async function resetUserPasswordAction(
  userId: number,
  _prevState: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    await authApi(`/api/users/${userId}/reset-password`, {
      method: "PATCH",
      body: JSON.stringify({ newPassword }),
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to reset password" };
  }

  return { success: true };
}
