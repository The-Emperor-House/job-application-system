import { NextRequest, NextResponse } from "next/server";
import { authApi, ApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const data = await authApi("/api/applications", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message, code: err.code }, { status: err.status });
    }
    throw err;
  }
}
