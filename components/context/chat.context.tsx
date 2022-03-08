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
  messageWindowRef: MutableRefObject<HTMLDivElement>
  addMessage: Function
  clearMessages: Function
}
let messageStore: Array<Message> = []

const ChatContext = createContext<AppContextInterface | null>(null)

interface props {
  children: any
}

export const ChatProvider: NextPage<props> = ({ children }) => {
  const [messages, setMessages] = useState<Array<Message>>([])

  const addMessage = (message: Message) => {
    messageStore.push(message)

    setMessages([...messageStore])
  }

  const clearMessages = () => {
    messageStore = []
    setMessages([])
  }

  const messageWindowRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>

  return (
    <ChatContext.Provider
      value={{
        messages,
        messageWindowRef,
        addMessage,
        clearMessages,
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
