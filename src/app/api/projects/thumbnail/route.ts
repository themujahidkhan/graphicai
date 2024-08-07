import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { projects } from "@/db/schema";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
	const session = await auth();

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const formData = await request.formData();
	const thumbnail = formData.get("thumbnail") as File;
	const projectId = formData.get("projectId") as string;

	if (!thumbnail || !projectId) {
		return NextResponse.json(
			{ error: "Missing thumbnail or project ID" },
			{ status: 400 },
		);
	}

	try {
		const { url } = await put(thumbnail.name, thumbnail, {
			access: "public",
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});

		await db
			.update(projects)
			.set({ thumbnailUrl: url })
			.where(eq(projects.id, projectId));

		return NextResponse.json({ thumbnailUrl: url });
	} catch (error) {
		console.error("Error uploading thumbnail:", error);
		return NextResponse.json(
			{ error: "Failed to upload thumbnail" },
			{ status: 500 },
		);
	}
}
