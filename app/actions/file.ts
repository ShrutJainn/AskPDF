"use server";

import { db } from "@/db";
import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getFiles(userId: string | undefined) {
  const files = await db.file.findMany({
    where: { userId: userId },
  });
  return files;
}

export async function getFile(fileId: string) {
  const file = await db.file.findUnique({
    where: {
      id: fileId,
    },
  });
  return file;
}
export async function deleteFile(fileId: string | undefined) {
  const res = await db.file.delete({
    where: {
      id: fileId,
    },
  });
  return res;
}

export async function getFileByKey(key: string) {
  const session = await getServerSession(NEXT_AUTH);
  const userId = session.user.id;
  if (!session) throw new Error("Unauthorized");

  const file = await db.file.findFirst({
    where: {
      userId,
      key,
    },
  });
  if (!file) throw new Error("File not found");

  return file;
}
