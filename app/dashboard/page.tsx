import { useSession } from "next-auth/react";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import Dashboard from "@/components/Dashboard";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

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
  const session = await getServerSession(NEXT_AUTH);
  const userId = session?.user?.id;

  if (!userId) redirect("/api/auth/signin");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) redirect("/api/auth/signin");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return <Dashboard subscriptionPlan={subscriptionPlan} />;
}

export default Page;
