"use client";

import { GoogleLogin } from "@react-oauth/google";
import { AuthUser } from "@/lib/types";

export default function GoogleSignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: (user: AuthUser) => void;
  onError: (message: string) => void;
}) {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        if (!credentialResponse.credential) {
          onError("เข้าสู่ระบบด้วย Google ไม่สำเร็จ");
          return;
        }

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: credentialResponse.credential }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          onError(data.message ?? "เข้าสู่ระบบด้วย Google ไม่สำเร็จ");
          return;
        }

        onSuccess(data.user);
      }}
      onError={() => onError("เข้าสู่ระบบด้วย Google ไม่สำเร็จ")}
    />
  );
}
