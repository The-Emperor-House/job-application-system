import { NextRequest, NextResponse } from "next/server";
import { authApi, ApiError } from "@/lib/api";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; attachmentId: string }> }) {
  const { id, attachmentId } = await params;
  try {
    await authApi(`/api/applications/my/${id}/attachments/${attachmentId}`, { method: "DELETE" });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message, code: err.code }, { status: err.status });
    }
    throw err;
  }
}
