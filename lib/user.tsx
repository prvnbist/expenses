import React from 'react'

import { Loader } from '../components'
import useAuth from '../hooks/useAuth'

export interface IUser {
   issuer?: string
   publicAddress?: string
   email?: string
   oauthProvider?: null
   phoneNumber?: null
   id?: string
   username?: string
}

export interface IUserContext {
   user: IUser
}

const Context = React.createContext<IUserContext | null>(null)

interface IUserProviderProps {
   children: React.ReactNode
}

export const UserProvider = ({ children }: IUserProviderProps): JSX.Element => {
   const { user, loading } = useAuth()

   if (loading) return <Loader />
   return <Context.Provider value={{ user }}>{children}</Context.Provider>
}

export const useUser = () => React.useContext(Context)
