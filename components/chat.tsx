"use client";

import { useChat, type Message } from "ai/react";

import { cn } from "@/lib/utils";
import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { EmptyScreen } from "@/components/empty-screen";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";
import React from "react";
import Link from "next/link";
import { badgeVariants } from "./ui/badge";
import { IconUsers } from "./ui/icons";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "./ui/textarea";
import { api } from "@/trpc/react";
import { auth } from "@/auth";


const IS_PREVIEW = process.env.VERCEL_ENV === "preview";
export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  chatId?: string;
  userId?: string;
}

export function Chat({ chatId, userId, initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    "ai-token",
    null
  );
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW);
  const [previewTokenInput, setPreviewTokenInput] = useState(
    previewToken ?? ""
  );
  const [contactProfessionalDialogOpen, setContactProfessionalDialogOpen] =
    useState(false);
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id: chatId,
      body: {
        id: chatId,
        previewToken,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });

  const contactProfessionalFormSchema = z.object({
    additionalNotes: z.string().min(2).max(300),
  });

  const form = useForm<z.infer<typeof contactProfessionalFormSchema>>({
    resolver: zodResolver(contactProfessionalFormSchema),
    defaultValues: {
      additionalNotes: "",
    },
  });

  const customerRequestMutation = api.customerRequest.create.useMutation();
  // const customerRequestQuery = api.customerRequest.all.useQuery();

  const onSubmit = async (values: z.infer<typeof contactProfessionalFormSchema>) => {
    console.log(values);
    await customerRequestMutation.mutateAsync({
      chatId: chatId ?? '123',
      userId: userId ?? '222',
      // userId: '222',
      additionalNotes: values.additionalNotes,
    });
    setContactProfessionalDialogOpen(false);

    form.reset();

    toast.success('Request send', {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        fontSize: '14px'
      },
      iconTheme: {
        primary: 'white',
        secondary: 'black'
      }
    })
  }

  return (
    <>
      <div>{'hello'}</div>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={chatId}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        contactProfessionalDialogOpen={contactProfessionalDialogOpen}
        setContactProfessionalDialogOpen={setContactProfessionalDialogOpen}
      />

      <Dialog
        open={contactProfessionalDialogOpen}
        onOpenChange={setContactProfessionalDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share link to chat</DialogTitle>
            <DialogDescription>
              Anyone with the URL will be able to view the shared chat.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter additional notes here" {...field} />
              </FormControl>
              <FormDescription>
                Put here any additional notes you would like to share with the professional.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
          <DialogFooter className="items-center">
            <Link
              href=""
              className={cn(badgeVariants({ variant: "secondary" }), "mr-auto")}
              target="_blank"
            >
              <IconUsers className="mr-2" />
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{" "}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{" "}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={(e) => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput);
                setPreviewTokenDialog(false);
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
