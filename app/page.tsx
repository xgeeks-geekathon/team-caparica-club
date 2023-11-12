import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { auth } from '@/auth'

// export const runtime = 'edge'
export const runtime = 'nodejs'

export default async function IndexPage() {

  const session = await auth()

  const chatId = nanoid()

  return <Chat chatId={chatId} userId={session?.user?.id.toString()} />
}
