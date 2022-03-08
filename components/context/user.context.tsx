import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useContext, useState, useEffect, createContext } from 'react'

interface AppContextInterface {
  currentUser: User | null
  connectedUser: User | null
  setCurrentUser: Function
  setConnectedUser: Function
}

export interface User {
  name: string
}

const UserContext = createContext<AppContextInterface | null>(null)

interface props {
  children: any
}

export const UserProvider: NextPage<props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [connectedUser, setConnectedUser] = useState<User | null>(null)

  return (
    <UserContext.Provider
      value={{
        currentUser,
        connectedUser,
        setCurrentUser,
        setConnectedUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error(
      'Component must be enclosed by UserProvider to be able to use UserContext'
    )
  }

  return userContext
}
