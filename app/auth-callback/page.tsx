"use client";

import { Loader2 } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { createUser } from "../actions/user";
import { useEffect, useState } from "react";

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  useEffect(() => {
    async function syncUserAndRedirect() {
      try {
        const data = await createUser(); // Sync user data to the database
        console.log(data);

        // Redirect after user sync is complete
        if (data?.success) router.push(origin ? `/${origin}` : "/dashboard");
      } catch (error) {
        console.error("Error syncing user:", error);
      }
    }

    syncUserAndRedirect();
  }, [origin, router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
}

export default Page;
