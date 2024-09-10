import { getFile } from "@/app/actions/file";
import { NEXT_AUTH } from "@/lib/auth";
import ChatWrapper from "@/components/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface PageProps {
  params: {
    fileId: string;
  };
}

async function Page({ params }: PageProps, req: NextRequest) {
  const file = await getFile(params.fileId);
  const session = await getServerSession(NEXT_AUTH);

  if (!session) return redirect("/api/auth");
  return (
    <div className=" flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className=" mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
        {/* left side */}
        <div className=" flex-1 xl:flex">
          <div className=" px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer />
          </div>
        </div>

        {/* right side */}
        <div className=" shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
}

export default Page;
