import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import { NextPage } from 'next'
import { createRef, MutableRefObject, useRef, useState } from 'react'
import { CirclesWithBar } from 'react-loader-spinner'

export enum MessageType {
  Sent = 'Sent',
  Received = 'Received',
}

export interface Message {
  text: string
  type: MessageType
}

interface Props {
  currentUser: {
    name: string
  } | null
  connectedUser: {
    name: string
  } | null
  messages: Array<Message>
  onSend: Function
  onExit: Function
}

export const ChatWindow: NextPage<Props> = (props: Props) => {
  const [text, setText] = useState('')
  const messageWindowRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>

  const sendMessage = () => {
    props.onSend(text)

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
      {props.connectedUser !== null ? (
        <div className='grid grid-rows-8 h-screen w-screen'>
          <div className='row-span-1 grid grid-cols-8'>
            <div className='hidden md:inline md:col-span-1 '></div>
            <div className='col-span-8 md:col-span-6 bg-red-400 rounded-full m-4 p-1 flex justify-center items-center'>
              <h1 className='text-xl md:text-3xl font-heading'>
                Hi, {props.currentUser?.name}. You are connected to{' '}
                {props.connectedUser?.name}.
              </h1>
            </div>
            <div className='hidden md:inline md:col-span-1 '></div>
          </div>
          <div className='row-span-6 grid grid-cols-8'>
            <div className='hidden md:inline col-span-1 '></div>
            <div
              ref={messageWindowRef}
              className='rounded border-2 border-black col-span-8 md:col-span-6 px-2 overflow-y-scroll'
            >
              {props.messages.map((message: Message, index: number) => {
                if (message.type === MessageType.Sent) {
                  return (
                    <div
                      key={index}
                      className='content-end mb-2 flex justify-end text-lg'
                    >
                      <div className=' border-2 rounded-md p-2 border-black w-fit'>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={index}
                      className='content-end w-fit mb-2 flex justify-start border-2 rounded-md p-2 border-black text-lg'
                    >
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
                className='rounded-full flex justify-center items-center bg-red-500 m-4 col-span-2 md:col-span-1 cursor-pointer'
                onClick={() => {
                  props.onExit()
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
                className='px-4 py-2 text-lg col-span-6 rounded-full border-2 border-black m-4'
              />
              <div
                className='rounded-full flex justify-center items-center bg-green-500 m-4 col-span-2 md:col-span-1 cursor-pointer'
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
