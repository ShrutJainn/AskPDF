"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function createUser() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user.id || !user.email) {
      throw new Error("Unauthorized");
    }
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.log(error);
  }
}
