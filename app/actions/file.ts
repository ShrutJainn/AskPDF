"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user.id;
  if (!userId) throw new Error("Unauthorized");

  const file = await db.file.findFirst({
    where: {
      userId,
      key,
    },
  });
  if (!file) throw new Error("File not found");

  return file;
}

export async function getFileUploadStatus(fileId: string | undefined) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user.id;
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return { status: "PENDING" as const };

  return { status: file.uploadStatus };
}
