import { NextPage } from 'next'
import { useRouter } from 'next/router'
import {
  useContext,
  useState,
  useEffect,
  createContext,
  MutableRefObject,
  useRef,
} from 'react'
import { Message } from '../chat/chat-window'

interface AppContextInterface {
  messages: Array<Message>
  setMessages: Function
  messageWindowRef: MutableRefObject<HTMLDivElement>
}

const ChatContext = createContext<AppContextInterface | null>(null)

interface props {
  children: any
}

export const ChatProvider: NextPage<props> = ({ children }) => {
  const [messages, setMessages] = useState<Array<Message>>([])

  const messageWindowRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        messageWindowRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const chatContext = useContext(ChatContext)

  if (!chatContext) {
    throw new Error(
      'Component must be enclosed by ChatProvider to be able to use ChatContext'
    )
  }

  return chatContext
}
