import React from 'react'
import { useRouter } from 'next/router'
import { useLazyQuery, useMutation } from '@apollo/client'

import supabase from './supabase'
import QUERIES from 'graphql/queries'
import { MUTATIONS } from 'graphql/mutations'

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
   const router = useRouter()
   const [user, setUser] = React.useState({})
   const [getUser] = useLazyQuery(QUERIES.USERS.LIST, {
      onCompleted: ({ users = [] }) => {
         if (users.length > 0) {
            setUser(users[0])
         }
      },
      onError: () => {
         setUser({})
         router.push('/')
      },
   })
   const [upsert_user] = useMutation(MUTATIONS.USER.UPSERT, {
      onCompleted: ({ insert_user = {} }) => {
         setUser(insert_user)
         router.push(`/dashboard`)
      },
      onError: () => {
         setUser({})
         router.push('/')
      },
   })
   React.useEffect(() => {
      supabase.auth.onAuthStateChange((event, session) => {
         if (event === 'SIGNED_IN') {
            if (session?.user?.app_metadata?.provider === 'google') {
               const user = session?.user?.user_metadata
               upsert_user({
                  variables: {
                     object: {
                        name: user?.name || '',
                        email: user?.email || '',
                        supabase_user_id: session?.user?.id,
                        profile_picture: user?.picture || '',
                        username: user?.email?.replace(/@.*$/, '') || '',
                     },
                  },
               })
            }
         } else if (event === 'SIGNED_OUT') {
            setUser({})
            router.push('/')
         }
      })
   }, [])

   React.useEffect(() => {
      const user = supabase.auth.user()
      if (user?.id) {
         getUser({
            variables: { where: { supabase_user_id: { _eq: user?.id } } },
         })
      } else {
         setUser({})
         router.push('/')
      }
   }, [])

   return <Context.Provider value={{ user }}>{children}</Context.Provider>
}

export const useUser = () => React.useContext(Context)
