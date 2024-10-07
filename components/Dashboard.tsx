"use client";

// import UploadButton from "@/components/UploadButton";
import { Ghost, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { deleteFile, getFiles } from "@/app/actions/file";
import UploadButton from "./UploadButton";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

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

interface PageProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

function Dashboard({ subscriptionPlan }: PageProps) {
  const { user } = useKindeBrowserClient();

  const userId = user?.id;
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    async function fetchFiles() {
      const res = await getFiles(userId);
      //@ts-ignore
      setFiles(res);

      setLoading(false);
    }
    fetchFiles();
  }, [userId]);

  async function handleDeleteFile(fileId: string) {
    const res = await deleteFile(fileId);
    const updatedFiles = files.filter((file) => file?.id !== fileId);
    setFiles(updatedFiles);
  }
  return (
    <main className=" mx-auto max-w-7xl md:p-10">
      <div className=" mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className=" mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
      </div>

      {!loading ? (
        files.length === 0 ? (
          <div className=" mt-16 flex flex-col items-center gap-2">
            <Ghost className=" h-8 w-8 text-zinc-800" />
            <h3 className=" font-semibold text-xl">Pretty empty around here</h3>
            <p>Let&apos;s upload your first PDF.</p>
          </div>
        ) : (
          <ul className=" mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => {
              return (
                <li
                  key={file?.id}
                  className=" col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                >
                  <Link
                    href={`/dashboard/${file?.id}`}
                    className=" flex flex-col gap-2"
                    prefetch={true}
                  >
                    <div className=" pt-6 px-6 flex w-full items-center justify-between space-x-6">
                      <div className=" h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                      <div className=" flex-1 truncate">
                        <div className=" flex items-center space-x-3">
                          <h3 className=" truncate text-lg font-medium text-zinc-900">
                            {file.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className=" px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                    <div className=" flex items-center gap-2">
                      <Plus className=" h-4 w-4" />
                      {format(file?.createdAt, "MMM yyyy")}
                    </div>
                    <div className=" flex items-center gap-2">
                      <MessageSquare className=" h-4 w-4" />
                      {file.url.slice(0, 15)}...
                    </div>
                    <Button
                      size="sm"
                      className=" w-full"
                      variant="destructive"
                      onClick={() => handleDeleteFile(file?.id)}
                      disabled={loading}
                    >
                      <Trash className=" h-4 w-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )
      ) : (
        <Skeleton height={100} className=" my-2 " count={3} />
      )}
    </main>
  );
}

export default Dashboard;
