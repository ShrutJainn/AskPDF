"use client";

import React, { createContext, ReactNode, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { sendMessageApi } from "@/app/actions/message";
import axios from "axios";

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

  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      // const response = await fetch("/api/message", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     fileId,
      //     message,
      //   }),
      // });
      const response = await axios.post("/api/message", { fileId, message });
      // const response = await sendMessageApi({ fileId, message });
      // if (!response.ok) {
      //   throw new Error("Failed ot send message");
      // }

      // return response.body;
      console.log(response);
    },
  });

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  function addMessage() {
    sendMessage({ message });
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
