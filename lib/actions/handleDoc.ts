"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import { processFile } from "./vectorStore";

export async function uploadDocument(file: File) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return { error: "User not found" };
  }

  if (!file) {
    return { error: "No file uploaded" };
  }

  const blob = await put(`documents/${user.id}/${file.name}`, file, {
    access: "public",
  });

  const doc = await prisma.document.create({
    data: {
      title: file.name,
      fileUrl: blob.url,
      userId: user.id,
    },
  });

  await processFile(blob.url, doc.id);

  return { success: true, docId: doc.id, blobUrl: blob.url };
}
