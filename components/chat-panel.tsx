import { type UseChatHelpers } from "ai/react";

import { Button } from "@/components/ui/button";
import { PromptForm } from "@/components/prompt-form";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import {
  IconRefresh,
  IconStop,
  IconUser,
} from "@/components/ui/icons";
import { FooterText } from "@/components/footer";
import React from "react";

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string;
  contactProfessionalDialogOpen: boolean;
  setContactProfessionalDialogOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  contactProfessionalDialogOpen,
  setContactProfessionalDialogOpen,
}: ChatPanelProps) {
  
  const clickedContactProfessional = () => {
    setContactProfessionalDialogOpen(!contactProfessionalDialogOpen);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex items-center justify-center h-10">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <div>
                {messages?.length > 4 && <Button
                  variant="outline"
                  onClick={() => clickedContactProfessional()}
                  className="bg-background"
                >
                  <IconUser className="mr-2" />
                  Contact Residency Professional
                </Button>}
                <Button
                  variant="outline"
                  onClick={() => reload()}
                  className="bg-background"
                >
                  <IconRefresh className="mr-2" />
                  Regenerate Response
                </Button>
              </div>
            )
          )}
        </div>
        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async (value) => {
              await append({
                id,
                content: value,
                role: "user",
              });
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
