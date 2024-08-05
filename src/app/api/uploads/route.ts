import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { userUploads } from "@/db/schema";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");

	if (!userId) {
		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
	}

	const session = await auth();

	if (!session || session.user?.id !== userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const uploads = await db
		.select()
		.from(userUploads)
		.where(eq(userUploads.userId, userId));

	return NextResponse.json(uploads);
}

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const imageId = searchParams.get("id");

	if (!imageId) {
		return NextResponse.json(
			{ error: "Image ID is required" },
			{ status: 400 },
		);
	}

	const session = await auth();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const image = await db
		.select()
		.from(userUploads)
		.where(eq(userUploads.id, imageId))
		.limit(1);

	if (!image || image[0].userId !== session.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await db.delete(userUploads).where(eq(userUploads.id, imageId));

	return NextResponse.json({ success: true });
}
