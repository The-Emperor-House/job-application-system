"use client";

import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <Button onClick={handleLogout} size="small" color="inherit">
      Log out
    </Button>
  );
}
