import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { XataVectorSearch } from "langchain/vectorstores/xata";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseClient } from "@xata.io/client";
import { ChatOpenAI } from 'langchain/chat_models/openai'

import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { formatDocumentsAsString } from "langchain/util/document";

// Just import getXataClient from the generated xata.ts instead.
const getXataClient = () => {
  if (!process.env.XATA_API_KEY) {
    throw new Error("XATA_API_KEY not set");
  }

  if (!process.env.XATA_DB_URL) {
    throw new Error("XATA_DB_URL not set");
  }
  const xata = new BaseClient({
    databaseURL: process.env.XATA_DB_URL,
    apiKey: process.env.XATA_API_KEY,
    branch: process.env.XATA_BRANCH || "main",
  });
  return xata;
};

const client = getXataClient();
const table = "vectors";
const embeddings = new OpenAIEmbeddings();
const vectorStore = new XataVectorSearch(embeddings, { client, table });


import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  // const stream = OpenAIStream(res, {
  //   async onCompletion(completion) {
  //     const title = json.messages[0].content.substring(0, 100)
  //     const id = json.id ?? nanoid()
  //     const createdAt = Date.now()
  //     const path = `/chat/${id}`
  //     const payload = {
  //       id,
  //       title,
  //       userId,
  //       createdAt,
  //       path,
  //       messages: [
  //         ...messages,
  //         {
  //           content: completion,
  //           role: 'assistant'
  //         }
  //       ]
  //     }
  //     await kv.hmset(`chat:${id}`, payload)
  //     await kv.zadd(`user:chat:${userId}`, {
  //       score: createdAt,
  //       member: `chat:${id}`
  //     })
  //   }
  // })

  const questionPrompt = PromptTemplate.fromTemplate(
    `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. 
    Act as a Residency Lawyer Professional in Portugal, working with expats who are looking to relocate to Portugal. You are precise in your answers and give friendly explanations of the steps required to get Visa in Portugal also you give detailed requirements for each persons case. You must always ask 1 (one) and more follow-up question.
  ----------
  CONTEXT: {context}
  ----------
  CHAT HISTORY: {chatHistory}
  ----------
  QUESTION: {question}
  ----------
  Helpful Answer:`
  );
  
  const retriever = vectorStore.asRetriever();
  const model = new ChatOpenAI({
    streaming: true,
  });

  const chain = RunnableSequence.from([
    {
      question: (input: { question: string; chatHistory?: string }) =>
        input.question,
      chatHistory: (input: { question: string; chatHistory?: string }) =>
        input.chatHistory ?? "",
      context: async (input: { question: string; chatHistory?: string }) => {
        const relevantDocs = await retriever.getRelevantDocuments(input.question);
        const serialized = formatDocumentsAsString(relevantDocs);
        return serialized;
      },
    },
    questionPrompt,
    model,
    new StringOutputParser(),
  ]);
  
  let lastMessage = messages[messages.length - 1].content;
  console.log("lastMessage");
  console.log(lastMessage);

  const stream2 = await chain.stream({
    question: lastMessage,
  });

  return new StreamingTextResponse(stream2)
}