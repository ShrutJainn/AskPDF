import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import NextAuth from "next-auth/next";
import { getSession } from "next-auth/react";

async function Page() {
  return <div>hi there</div>;
}

export default Page;
