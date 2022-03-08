import { NextPage } from 'next/types'
import { useState } from 'react'
import { useSocket } from '../../context/socket.context'

interface Props {
  socketServerUrl: string
}

export const StartChatComponent: NextPage<Props> = (props: Props) => {
  const [name, setName] = useState('')
  const { onStart } = useSocket()

  return (
    <div className='mx-2 my-auto md:m-auto  p-8 rounded font-heading'>
      <h1 className='text-4xl mb-8 text-center'>Welcome to UnFold</h1>
      <div className='grid grid-rows-2'></div>
      <div className='row-span-1'>
        <form
          onSubmit={() => {
            onStart(name, props.socketServerUrl)
          }}
        >
          <div className=' border-2 border-black rounded p-2 text-lg mb-4'>
            <input
              required
              className='outline-0 bg-transparent'
              placeholder='Enter you name here'
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </div>
          <button className='w-full row-span-1 bg-blue-400 p-2 rounded flex justify-center items-center cursor-pointer'>
            Start Chat
          </button>
        </form>
      </div>
    </div>
  )
}
