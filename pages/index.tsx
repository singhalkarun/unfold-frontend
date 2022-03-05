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

export interface User {
  name: string
}

const Home: NextPage = () => {
  const router = useRouter()

  const [connectedUser, setConnectedUser] = useState<User | null>(null)

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [messages, setMessages] = useState<Array<Message>>([])

  const [sentMessageCount, setSentMessageCount] = useState(0)

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

    setMessages([...messages, message])
  }

  const onSend = (text: string) => {
    if (text.trim() === '') {
      return
    }
    const message: Message = {
      text,
      type: MessageType.Sent,
    }

    setMessages([...messages, message])
    setSentMessageCount(sentMessageCount + 1)
  }

  const onExit = () => {
    setConnectedUser(null)
    setMessages([])

    setTimeout(() => connectUser(), 3000)
  }

  const connectUser = async () => {
    try {
      const config: Config = {
        dictionaries: [names],
      }
      const name: string = uniqueNamesGenerator(config) // Winona

      const userFound: User = {
        name,
      }

      setConnectedUser(userFound)
    } catch (error) {}
  }

  const onStart = (name: string) => {
    const user: User = {
      name,
    }

    setCurrentUser(user)

    connectUser()
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

export default Home
