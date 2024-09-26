import { getFileMessages } from "@/app/actions/message";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { Divide, Loader2, MessageSquareIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Message from "./Message";
import { measureMemory } from "vm";
import { useRecoilState } from "recoil";
import { messageAtom } from "@/atoms/messageAtom";
import { ChatContext } from "./ChatContext";

type MessageType = {
  id: string;
  text: string;
  isUserMessage: boolean;
  createdAt: Date;
};

function Messages({ fileId }: { fileId: string }) {
  const [messages, setMessages] = useRecoilState(messageAtom);
  const { isLoading } = useContext(ChatContext);
  useEffect(() => {
    async function getMessages() {
      const { messages } = await getFileMessages({
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      });
      //@ts-ignore
      setMessages(messages);
    }
    getMessages();
  }, [fileId, setMessages]);
  const loadingMessage = {
    id: "loading-message",
    createdAt: new Date().toISOString(),
    isUser: false,
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(messages ?? []),
    ...(isLoading ? [loadingMessage] : []),
  ];
  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        //@ts-ignore
        combinedMessages.map((message, index) => {
          const isNextMessgeSamePerson =
            combinedMessages[index - 1]?.isUserMessage ===
            combinedMessages[index]?.isUserMessage;
          return (
            <Message
              key={index}
              //@ts-ignore
              message={message}
              //@ts-ignore
              isNextMessgeSamePerson={isNextMessgeSamePerson}
            />
          );
        })
      ) : isLoading ? (
        <div className=" w-full flex flex-col gap-2">
          <Skeleton className=" h-16" />
          <Skeleton className=" h-16" />
          <Skeleton className=" h-16" />
          <Skeleton className=" h-16" />
        </div>
      ) : (
        <div className=" flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquareIcon className=" h-8 w-8 text-blue-500" />
          <h3 className=" font-semibold text-xl">You&apos;re all set!</h3>
          <p className=" text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
}

export default Messages;
