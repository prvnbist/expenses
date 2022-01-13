import React from 'react'

import { Loader } from '../components'
import useAuth from '../hooks/useAuth'

const Context = React.createContext(null)

interface IUserProviderProps {
   children: React.ReactNode
}

export const UserProvider = ({ children }: IUserProviderProps): JSX.Element => {
   const { user, loading } = useAuth()

   if (loading) return <Loader />
   return <Context.Provider value={{ user }}>{children}</Context.Provider>
}

export const useUser = () => React.useContext(Context)
