import axios from 'axios'
import type { NextPage } from 'next'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import {
  ChatWindow,
  Message,
  MessageType,
} from '../components/chat/chat-window'
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator'
import Head from 'next/head'
import * as gtag from '../src/lib/gtag'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { Socket } from 'socket.io-client'
import io from 'socket.io-client'
import Image from 'next/image'
import illustration from '../public/images/illustration.gif'
import useSound from 'use-sound'
import { Header } from '../components/head/head'
import { HomePage } from '../components/home/home.page'
import { useUser } from '../components/context/user.context'
import { useSocket } from '../components/context/socket.context'
import { useChat } from '../components/context/chat.context'

interface Props {
  socketServerUrl: string
}

const Home: NextPage<Props> = (props: Props) => {
  const { currentUser } = useUser()
  const { socket } = useSocket()

  const router = useRouter()

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
      <Header />
      {currentUser === null ? (
        <div className='grid grid-cols-2 grid-flow-row h-1/2 md:h-screen flex items-center'>
          <div className='col-span-2 md:col-span-1 hidden md:inline'>
            <Image
              src={illustration}
              width='50%'
              height='50%'
              layout='responsive'
            />
          </div>
          <div className='col-span-2 md:col-span-1'>
            <HomePage socketServerUrl={props.socketServerUrl} />
          </div>
        </div>
      ) : (
        <ChatWindow />
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
