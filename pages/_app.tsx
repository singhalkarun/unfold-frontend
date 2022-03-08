import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '../components/context/user.context'
import { SocketProvider } from '../components/context/socket.context'
import { ChatProvider } from '../components/context/chat.context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ChatProvider>
        <SocketProvider>
          <Component {...pageProps} />
        </SocketProvider>
      </ChatProvider>
    </UserProvider>
  )
}

export default MyApp
