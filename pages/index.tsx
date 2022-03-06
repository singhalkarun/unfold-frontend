import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import {
  ChatWindow,
  Message,
  MessageType,
} from '../components/chat/chat-window'
import { LoginWindow } from '../components/login/login-window'
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator'
import Head from 'next/head'
import * as gtag from '../src/lib/gtag'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { Socket } from 'socket.io-client'
import io from 'socket.io-client'
import { SocketAddress } from 'net'

export interface User {
  name: string
}

interface Props {
  socketServerUrl: string
}
var messageStore: Array<Message> = []

const Home: NextPage<Props> = (props: Props) => {
  const router = useRouter()

  const [connectedUser, setConnectedUser] = useState<User | null>(null)

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [messages, setMessages] = useState<Array<Message>>([])

  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    window.addEventListener('onbeforeunload', () => {
      socket?.close
    })
  })

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const onReceive = (text: string) => {
    const message: Message = {
      text,
      type: MessageType.Received,
    }

    messageStore.push(message)

    setMessages([...messageStore])
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

    messageStore.push(message)

    setMessages([...messageStore])
  }

  const onExit = () => {
    setConnectedUser(null)
    setMessages([])
    messageStore = []

    socket?.emit('userDisconnect', {})

    setCurrentUser(null)

    socket?.close()
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
      messageStore = []

      socket.emit('userConnect', {})
    })

    return () => {
      socket?.close()
    }
  }, [socket])

  const onStart = (name: string) => {
    const user: User = {
      name,
    }

    const socket: Socket = io(props.socketServerUrl, {
      path: '/websocket',
      query: {
        name,
      },
    })

    setSocket(socket)

    setCurrentUser(user)
  }

  return (
    <>
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=G-${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id='googleAnalytics'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-${gtag.GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
             `,
        }}
      />
      <Head>
        <title>Free Your Mind</title>
      </Head>
      {currentUser === null ? (
        <LoginWindow onStart={onStart} />
      ) : (
        <ChatWindow
          currentUser={currentUser}
          connectedUser={connectedUser}
          messages={messages}
          onSend={onSend}
          onExit={onExit}
        />
      )}
    </>
  )
}

export async function getStaticProps() {
  const socketServerUrl = process.env.socketServerUrl

  return {
    props: {
      socketServerUrl,
    },
  }
}

export default Home
