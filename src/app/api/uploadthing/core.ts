import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { userUploads } from "@/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      const session = await auth();

      if (!session) throw new UploadThingError("Unauthorized");

      return { userId: session.user?.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (!metadata.userId) {
        throw new Error("User ID is required");
      }

      const upload = await db.insert(userUploads).values({
        userId: metadata.userId,
        url: file.url,
      }).returning().execute();

      return { url: file.url, id: upload[0].id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;