import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { useSetRecoilState } from "recoil";
import { messageAtom } from "@/atoms/messageAtom";

function ChatInput({ isDisabled }: { isDisabled?: boolean }) {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);
  const setMessages = useSetRecoilState(messageAtom);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className=" absolute bottom-0 left-0 w-full">
      <form className=" mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className=" relative flex h-full flex-1 items-stretch md:flex-col">
          <div className=" relative flex flex-col w-full flex-grow p-4">
            <div className=" relative">
              <Textarea
                rows={1}
                ref={textareaRef}
                maxRows={4}
                autoFocus
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    //@ts-ignore
                    setMessages((prev) => [
                      ...prev,
                      {
                        text: message,
                        isUserMessage: true,
                        createdAt: new Date(),
                      },
                    ]);
                    addMessage();
                    textareaRef.current?.focus();
                  }
                }}
                className=" resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                placeholder=" Enter your question..."
              />

              <Button
                disabled={isLoading || isDisabled}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  //@ts-ignore
                  setMessages((prev) => [
                    ...prev,
                    {
                      text: message,
                      isUserMessage: true,
                      createdAt: new Date(),
                    },
                  ]);
                  addMessage();
                  textareaRef.current?.focus();
                }}
                aria-label="Send message"
                className=" absolute bottom-1.5 right-[8px]"
              >
                <Send className=" h-4 w-4" />
              </Button>
            </div>
            {/* <Button className=" mt-4 h-12">Clear chats</Button> */}
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
