"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat()

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Assistente Virtual</h3>
            <p className="text-sm text-muted-foreground">Pergunte sobre projetos e habilidades</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div key={message.id} className="whitespace-pre-wrap">
                {message.role === 'user' ? 'User: ' : 'AI: '}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  }
                })}
              </div>
            ))}
            {status === 'streaming' && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <form 
            onSubmit={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }} 
            className="p-4 border-t"
          >
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                disabled={status === 'streaming'}
              />
              <Button type="submit" size="icon" disabled={status === 'streaming'}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  )
}
