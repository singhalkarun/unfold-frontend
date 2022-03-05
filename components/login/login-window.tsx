import { NextPage } from 'next'
import { useState } from 'react'

interface Props {
  onStart: Function
}

export const LoginWindow: NextPage<Props> = (props: Props) => {
  const [name, setName] = useState('')

  return (
    <div className='flex h-screen'>
      <div className='mx-2 my-auto md:m-auto border-black border-2 p-8 rounded'>
        <h1 className='text-4xl mb-8'>Welcome to FreeYourMind</h1>
        <div className='grid grid-rows-2'></div>
        <div className='row-span-1'>
          <form
            onSubmit={() => {
              props.onStart(name)
            }}
          >
            <div className=' border-2 border-black rounded p-2 text-lg mb-4'>
              <input
                required
                className='outline-0'
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
    </div>
  )
}
