import axios from 'axios'
import type { NextPage } from 'next'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
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
import Image from 'next/image'
import illustration from '../public/happy.png'

export interface User {
  name: string
}

interface Props {
  socketServerUrl: string
}
var messageStore: Array<Message> = []

const Home: NextPage<Props> = (props: Props) => {
  const messageWindowRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>

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
    <div className='overflow-hidden'>
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
        <title>Random Chat</title>
        <meta
          name='description'
          content='Random Chat Space is built for users looking to talk somebody anonymously.'
        />
        <link rel='canonical' href='https://randomchat.space/' />
        <meta name='robots' content='index, follow' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0' />
        <meta property='og:title' content='Random Chat' />
        <meta property='og:image' content='../public/happy.png' />
      </Head>
      {currentUser === null ? (
        <div className='grid grid-cols-2 grid-flow-row h-1/2 md:h-screen flex items-center'>
          <div className='col-span-2 md:col-span-1'>
            <Image
              src={illustration}
              width='50%'
              height='50%'
              layout='responsive'
            />
          </div>
          <div className='col-span-2 md:col-span-1'>
            <LoginWindow onStart={onStart} />
          </div>
        </div>
      ) : (
        <ChatWindow
          currentUser={currentUser}
          connectedUser={connectedUser}
          messages={messages}
          onSend={onSend}
          onExit={onExit}
          messageWindowRef={messageWindowRef}
        />
      )}
    </div>
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
