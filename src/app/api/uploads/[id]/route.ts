import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { userUploads } from "@/db/schema";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  // Fetch the upload
  const [upload] = await db
    .select()
    .from(userUploads)
    .where(eq(userUploads.id, id))
    .limit(1);

  if (!upload) {
    return NextResponse.json({ error: "Upload not found" }, { status: 404 });
  }

  if (upload.userId !== session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete the upload
  await db.delete(userUploads).where(eq(userUploads.id, id));

  return NextResponse.json({ success: true });
}