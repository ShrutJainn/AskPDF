"use server";

import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { db } from "@/db";
import { NEXT_AUTH } from "@/lib/auth";
import { MessagePropsSchema } from "@/lib/validators/MessagePropsValidator";
import { getServerSession } from "next-auth";
import { z } from "zod";

type MessageProps = z.infer<typeof MessagePropsSchema>;

export async function getFileMessages({ fileId, limit, cursor }: MessageProps) {
  try {
    const queryLimit = limit ?? INFINITE_QUERY_LIMIT;

    const file = await db.file.findFirst({
      where: {
        id: fileId,
      },
    });
    if (!file) throw new Error("NOT FOUND");

    const messages = await db.message.findMany({
      // take: queryLimit + 1,
      where: {
        fileId,
      },
      orderBy: {
        createdAt: "asc",
      },
      // cursor: cursor ? { id: cursor } : undefined, //infinit query
      select: {
        id: true,
        isUserMessage: true,
        createdAt: true,
        text: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;

    // if (messages.length > queryLimit) {
    //   const nextItem = messages.pop();
    //   nextCursor = nextItem?.id;
    // }
    return { messages, nextCursor };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function getLatestAiResponse(fileId: string) {
  const message = await db.message.findFirst({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return message;
}
