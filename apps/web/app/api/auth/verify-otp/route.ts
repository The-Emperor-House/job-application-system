import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
import { setAuthCookie } from "@/lib/auth-cookie";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  return setAuthCookie(NextResponse.json({ user: data.user }), data.token);
}
