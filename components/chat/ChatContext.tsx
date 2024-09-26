"use client";

import React, { createContext, ReactNode, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { messageAtom } from "@/atoms/messageAtom";
import { getLatestAiResponse } from "@/app/actions/message";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setMessages = useSetRecoilState(messageAtom);

  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      try {
        setIsLoading(true);
        setMessage("");
        const response = await axios.post("/api/message", {
          fileId,
          message,
        });
        const aiResponse = await getLatestAiResponse(fileId);
        //@ts-ignore
        setMessages((prev) => [
          ...prev,
          {
            text: aiResponse?.text,
            isUserMessage: false,
            createdAt: aiResponse?.createdAt,
          },
        ]);
      } catch (error: any) {
        throw new Error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  function addMessage() {
    const aiMessage = sendMessage({ message });
    return aiMessage;
  }

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
