"use client";

import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

function Page() {
  const { data: session } = useSession();
  console.log(session?.user.id);

  return <div>Test</div>;
}

export default Page;
