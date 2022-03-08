import { NextPage } from 'next/types'
import { useState } from 'react'
import Swal from 'sweetalert2'

export const LoginSignupComponent: NextPage = () => {
  const [phone, setPhone] = useState('')

  const onCheck = (phone: string, e: any) => {
    e.preventDefault()
    Swal.fire({
      title: 'Work in Progress.',
      backdrop: 'rgba(0,0,123,0.4)',
    })
  }

  return (
    <div className='mx-2 my-auto md:m-auto  p-8 rounded font-heading'>
      <h1 className='text-4xl mb-8 text-center'>Welcome to UnFold</h1>
      <div className='grid grid-rows-2'></div>
      <div className='row-span-1'>
        <form
          onSubmit={(e) => {
            onCheck(phone, e)
          }}
        >
          <div className=' border-2 border-black rounded p-2 text-lg mb-4 flex items-center'>
            <p className='mr-2'>+91</p>
            <input
              required
              className='outline-0 bg-transparent'
              type='tel'
              onChange={(e) => {
                setPhone(e.target.value)
              }}
            />
          </div>
          <button className='w-full row-span-1 bg-blue-400 p-2 rounded flex justify-center items-center cursor-pointer'>
            Login/Signup
          </button>
        </form>
      </div>
    </div>
  )
}
