import { type ClassValue, clsx } from "clsx";
import { getServerSession } from "next-auth";
import { twMerge } from "tailwind-merge";
import { NEXT_AUTH } from "./auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;

  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}/${path}`;

  return `http://localhost:${process.env.PORT ?? 3000}/${path}`;
}

export async function getSession() {
  const session = await getServerSession(NEXT_AUTH);
  return session;
}
