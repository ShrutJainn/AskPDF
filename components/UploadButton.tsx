"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import DropZone from "react-dropzone";
import { Cloud, File, Loader, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { getFile, getFileByKey } from "@/app/actions/file";
import { useRouter } from "next/navigation";

function UploadDropzone({ isSubscribed }: { isSubscribed: boolean }) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();
  const { toast } = useToast();
  const { startUpload } = useUploadThing(
    isSubscribed ? "proPlanUploader" : "freePlanUploader"
  );

  async function pollForFile(key: string, interval = 1000) {
    try {
      const file = await getFileByKey(key);
      if (file) {
        router.push(`/dashboard/${file?.id}`);
        return file;
      } else {
        setTimeout(() => {
          pollForFile(key, interval);
        }, interval);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function startSimulatedProgress() {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        } else {
          return prev + 5;
        }
      });
    }, 500);

    return interval;
  }

  return (
    <DropZone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setUploading(true);
        const progressInterval = startSimulatedProgress();
        const maxSize = isSubscribed ? 16000000 : 4000000;
        if (acceptedFile[0].size > maxSize) {
          clearInterval(progressInterval);
          return toast({
            title: "Invalid Size",
            description: `Please upload PDFs upto ${
              isSubscribed ? "16" : "4"
            }MBs`,
            variant: "destructive",
          });
        }

        //handle file uploading
        const res = await startUpload(acceptedFile);
        if (!res) {
          clearInterval(progressInterval);
          return toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;
        const key = fileResponse?.key;

        if (!key) {
          return toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        const file = await pollForFile(key);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => {
        return (
          <div
            {...getRootProps()}
            className=" border h-64 m-4 border-dashed border-gray-300 rounded-lg"
          >
            <div className=" flex items-center justify-center h-full w-full">
              <label
                htmlFor="dropzone-file"
                className=" flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className=" flex flex-col items-center justify-center pt-5 pb-6">
                  <Cloud className=" h-6 w-6 text-zinc-500 mb-2" />
                  <p className=" mb2 text-sm text-zinc-700">
                    <span className=" font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className=" text-xs text-zinc-500">
                    PDF (up to {isSubscribed ? "16MB" : "4MB"})
                  </p>
                </div>

                {acceptedFiles && acceptedFiles[0] ? (
                  <div className=" max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                    <div className=" px-3 py-2 h-full grid place-items-center">
                      <File className=" h-4 w-4 text-blue-500" />
                    </div>
                    <div className=" px-3 py-2 h-full text-sm truncate">
                      {acceptedFiles[0].name}
                    </div>
                  </div>
                ) : null}

                {uploading ? (
                  <div className=" w-full mt-4 max-w-xs mx-auto">
                    <Progress
                      indicatorColor={
                        uploadProgress === 100 ? "bg-green-500" : ""
                      }
                      value={uploadProgress}
                      className=" h-1 w-full bg-zinc-200"
                    />
                    {uploadProgress === 100 ? (
                      <div className=" flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2 ">
                        <Loader2 className=" h-3 w-3 animate-spin" />
                        Redirecting...
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <input
                  {...getInputProps()}
                  type="file"
                  id="dropzone-file"
                  className=" hidden"
                />
              </label>
            </div>
          </div>
        );
      }}
    </DropZone>
  );
}

function UploadButton({ isSubscribed }: { isSubscribed: boolean }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
}

export default UploadButton;
