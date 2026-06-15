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
