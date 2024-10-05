"use server";

import { db } from "@/db";
import { redirect } from "next/navigation";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import Dashboard from "@/components/Dashboard";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

enum UploadStatus {
  PENDING,
  PROCESSING,
  FAILED,
  SUCCESS,
}

interface File {
  id: string;
  name: string;
  uploadStatus: UploadStatus;
  url: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userId = user.id;
  if (!userId) redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return <Dashboard subscriptionPlan={subscriptionPlan} />;
  // return <div>hi there</div>;
}

export default Page;
