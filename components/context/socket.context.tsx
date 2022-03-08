import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useContext, useState, useEffect, createContext } from 'react'
import { io, Socket } from 'socket.io-client'
import useSound from 'use-sound'
import { Message, MessageType } from '../chat/chat-window'
import { useChat } from './chat.context'
import { User, useUser } from './user.context'

interface AppContextInterface {
  socket: Socket | null
  setSocket: Function
  onStart: Function
  onReceive: Function
  onExit: Function
  onSend: Function
}

const SocketContext = createContext<AppContextInterface | null>(null)

interface props {
  children: any
}

export const SocketProvider: NextPage<props> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { messages, setMessages, messageWindowRef } = useChat()

  const { setConnectedUser, setCurrentUser } = useUser()

  const [play] = useSound('/sounds/notification.mp3', {
    interrupt: true,
  })

  const onReceive = (text: string) => {
    const message: Message = {
      text,
      type: MessageType.Received,
    }

    setMessages([...messages, message])

    play()

    setTimeout(() => {
      if (messageWindowRef.current) {
        messageWindowRef.current.scrollTop =
          messageWindowRef.current?.scrollHeight
      }
    }, 500)
  }

  const onSend = (text: string) => {
    if (text.trim() === '') {
      return
    }
    const message: Message = {
      text,
      type: MessageType.Sent,
    }

    socket?.emit('message', {
      text,
    })

    setMessages([...messages, message])
  }

  useEffect(() => {
    socket?.onAny((event) => {
      console.log(event)
    })
    socket?.on('connect', () => {
      socket.emit('userConnect', {})
    })

    socket?.on('userConnect', (args: any) => {
      const user: User = {
        name: args.name,
      }

      setConnectedUser(user)
    })

    socket?.on('message', (args: any) => {
      onReceive(args.text)
    })

    socket?.on('userDisconnect', () => {
      setConnectedUser(null)
      setMessages([])

      socket.emit('userConnect', {})
    })

    return () => {
      socket?.close()
    }
  }, [socket])

  const onStart = (name: string, socketServerUrl: string) => {
    const user: User = {
      name,
    }

    console.log('SocketServerUrl', socketServerUrl)

    const socket: Socket = io(socketServerUrl, {
      path: '/websocket',
      query: {
        name,
      },
    })

    setSocket(socket)

    setCurrentUser(user)
  }

  const onExit = () => {
    setConnectedUser(null)
    setMessages([])

    socket?.emit('userDisconnect', {})

    setCurrentUser(null)

    socket?.close()
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket,
        onStart,
        onReceive,
        onExit,
        onSend,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const socketContext = useContext(SocketContext)

  if (!socketContext) {
    throw new Error(
      'Component must be enclosed by SocketProvider to be able to use SokcetContext'
    )
  }

  return socketContext
}
