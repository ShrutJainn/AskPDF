import { db } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { userId } = req.body;
//   if (req.method === "POST") {
//     const files = await db.file.findMany({
//       where: {
//         //@ts-ignore
//         userId: userId,
//       },
//     });
//     if (!files) {
//       return res.status(400).json({ error: "No files found" });
//     }
//     return res.status(200).json(files);
//   }
// }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const files = await db.file.findMany({
    //@ts-ignore
    where: { userId: body.userId },
  });
  return NextResponse.json(files);
}
