import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id.toString())
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  console.log(`params.id=${params.id}`)
  console.log(`pasession.user.id=${session.user.id}`)

  const chat = await getChat(params.id, session.user.id.toString())

  if (!chat) {
    notFound()
  }

  // if (chat?.userId !== session?.user?.id) {
  //   notFound()
  // }

  return <Chat hidePanel={true} chatId={chat.id} initialMessages={chat.messages} userId={session?.user?.id.toString()}  />
}
