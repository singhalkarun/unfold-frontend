import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import { NextPage } from 'next'
import { createRef, MutableRefObject, useRef, useState } from 'react'
import { CirclesWithBar } from 'react-loader-spinner'
import { useChat } from '../context/chat.context'
import { useSocket } from '../context/socket.context'
import { useUser } from '../context/user.context'

export enum MessageType {
  Sent = 'Sent',
  Received = 'Received',
}

export interface Message {
  text: string
  type: MessageType
}

export const ChatWindow: NextPage = () => {
  const [text, setText] = useState('')
  const { onSend, onExit } = useSocket()
  const { messages, messageWindowRef } = useChat()
  const { connectedUser, currentUser } = useUser()

  const sendMessage = () => {
    onSend(text)

    setText('')

    setTimeout(() => {
      if (messageWindowRef.current) {
        messageWindowRef.current.scrollTop =
          messageWindowRef.current?.scrollHeight
      }
    }, 500)
  }

  return (
    <>
      {connectedUser !== null ? (
        <div className='grid grid-rows-8 h-screen w-screen '>
          <div className='row-span-1 grid grid-cols-8'>
            <div className='hidden md:inline md:col-span-1'></div>
            <div className='col-span-8 md:col-span-6 bg-gradient-to-r from-red-300 to-blue-300 rounded00 m-4 p-1 flex justify-center items-center'>
              <h1 className='text-xl font-bold md:text-3xl font-heading text-center p-2'>
                Hi, {currentUser?.name}. You are connected to{' '}
                {connectedUser?.name}.
              </h1>
            </div>
            <div className='hidden md:inline md:col-span-1 '></div>
          </div>
          <div className='row-span-6 grid grid-cols-8'>
            <div className='hidden md:inline col-span-1 '></div>
            <div
              ref={messageWindowRef}
              className='m-2 rounded no-scrollbar bg-skyBlue col-span-8 md:col-span-6 px-2 pt-2 pb-2 overflow-y-scroll'
            >
              {messages.map((message: Message, index: number) => {
                if (message.type === MessageType.Sent) {
                  return (
                    <div
                      key={index}
                      className='content-end mb-2 flex justify-end text-md md:text-lg'
                    >
                      <div className=' bg-white grid grid-row-2 rounded-t-md rounded-t-md rounded-bl-md p-2 w-fit'>
                        <p className='row-span-1 text-sm font-bold flex justify-start'>
                          {currentUser?.name}
                        </p>
                        <p className='row-span-1'>{message.text}</p>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={index}
                      className='content-end w-fit mb-2 rounded-t-md rounded-br-md p-2 bg-white text-md md:text-lg'
                    >
                      <p className='row-span-1 text-sm font-bold flex justify-start'>
                        {connectedUser?.name}
                      </p>
                      <p>{message.text}</p>
                    </div>
                  )
                }
              })}
            </div>
            <div className='hidden md:inline col-span-1 '></div>
          </div>
          <div className='row-span-1 grid grid-cols-8'>
            <div className='hidden md:inline md:col-span-1 '></div>

            <div className='col-span-8 md:col-span-6 md:col-span-6  grid grid-cols-10 md:grid-cols-8'>
              <div
                className='rounded flex justify-center items-center bg-red-500 my-6 mx-1 md:m-4 col-span-2 md:col-span-1 cursor-pointer'
                onClick={() => {
                  onExit()
                }}
              >
                <button className='text-xl md:text-4xl'>
                  <CloseIcon />
                </button>
              </div>
              <input
                onKeyDown={(e) => {
                  if (e.key == 'Enter') {
                    sendMessage()
                  }
                }}
                placeholder='Type your message here'
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                }}
                className='px-4 py-1 text-lg md:text-2xl col-span-6 rounded border-2 border-black  mx-1 m-4'
              />
              <div
                className='rounded flex justify-center items-center bg-green-500 my-6 mx-1 md:m-4 col-span-2 md:col-span-1 cursor-pointer'
                onClick={() => sendMessage()}
              >
                <button className='text-xl md:text-3xl'>
                  <SendIcon />
                </button>
              </div>
            </div>
            <div className='hidden md:inline md:col-span-1 '></div>
          </div>
        </div>
      ) : (
        <div className='flex h-screen'>
          <div className='m-auto'>
            <CirclesWithBar color='blue' />
          </div>
        </div>
      )}
    </>
  )
}
