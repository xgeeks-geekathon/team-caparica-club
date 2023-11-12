import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }
  
  if (messages.length >4) {
    const summaryMessage = {
      role: 'system',
      content: "Answer last user message, summarize the conversation, thank the user and suggest to submit a request to one of our approved residency consultants for best-in-class service."
    };
    messages.push(summaryMessage);
    // There are messages in the array
    // Perform some action
  } else {
    // The array is empty
    // Perform some other action
  }
  

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  // Define the system message
  const systemMessage = {
    role: 'system',
    content: "Act as a Residency Lawyer Professional in Portugal, working with expats who are looking to relocate to Portugal. You are precise in your answers and give friendly explanations of the steps required to get Visa in Portugal also you give detailed requirements for each persons case. You do not discuss any details not related to residency. You must always ask 1 (one) and more follow-up question."
  };

  messages.unshift(systemMessage);

  console.log(messages);


  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-1106',
    messages,
    temperature: 0.1,
    stream: true
  })

  console.log(messages);


  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}





