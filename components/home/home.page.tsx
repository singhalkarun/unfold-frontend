import { NextPage } from 'next'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { LoginSignupComponent } from './components/login-signup.component'
import { StartChatComponent } from './components/start-chat.component'

interface Props {
  onStart: Function
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
        <LoginSignupComponent
          onCheck={(phone: string, e: any) => {
            e.preventDefault()
            Swal.fire({
              title: 'Work in Progress.',
              backdrop: 'rgba(0,0,123,0.4)',
            })
          }}
        />
      ) : (
        <StartChatComponent onStart={props.onStart} />
      )}
    </div>
  )
}
