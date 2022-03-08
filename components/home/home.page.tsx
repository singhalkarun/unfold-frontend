import { NextPage } from 'next'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { LoginSignupComponent } from './components/login-signup.component'
import { StartChatComponent } from './components/start-chat.component'

interface Props {
  socketServerUrl: string
}

export const HomePage: NextPage<Props> = (props: Props) => {
  const [isLoginSignup, setIsLoginSignup] = useState(false)

  return (
    <div className='flex h-screen justify-center'>
      {isLoginSignup === true ? (
        <button
          className='absolute right-8 top-8 rounded p-2 text-lg bg-blue-400'
          onClick={() => setIsLoginSignup(false)}
        >
          Start Chat
        </button>
      ) : (
        <button
          className='absolute right-8 top-8 rounded p-2 text-lg bg-blue-400'
          onClick={() => setIsLoginSignup(true)}
        >
          Login/Signup
        </button>
      )}

      {isLoginSignup ? (
        <LoginSignupComponent />
      ) : (
        <StartChatComponent socketServerUrl={props.socketServerUrl} />
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
