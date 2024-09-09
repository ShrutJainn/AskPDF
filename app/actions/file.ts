"use server";

import { db } from "@/db";

export async function getFiles(userId: string | undefined) {
  const files = await db.file.findMany({
    where: { userId: userId },
  });
  return files;
}

export async function deleteFile(fileId: string | undefined) {
  const res = await db.file.delete({
    where: {
      id: fileId,
    },
  });
  return res;
}
