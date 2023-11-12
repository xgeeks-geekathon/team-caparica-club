import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'I am EU national - do I need a visa to work in Portugal?',
    message: `I am EU national - do I need a visa to work in Portugal?`
  },
  {
    heading: 'I am from Malaysia, want to be a digital nomad',
    message: 'I am from Malaysia, want to be a digital nomad'
  },
  {
    heading: 'What are requirements to work in Portugal as non-EU high-skilled immigrant',
    message: 'What are requirements to work in Portugal as non-EU high-skilled immigrant'
  },
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="max-w-3xl px-4 mx-auto">
      <div className="p-8 border rounded-lg bg-background">
        <h1 className="mb-2 text-lg font-semibold">
          This is Your Portuguese Residency assistant for incoming DevOps Engineers.
        </h1>
        <p className="leading-normal text-muted-foreground">
          What is your situation and what do you need help with?
        </p>
        <div className="flex flex-col items-start mt-4 space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}