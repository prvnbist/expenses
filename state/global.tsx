import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, ReactNode } from 'react'

import { Center, Loader } from '@mantine/core'

import { Entities } from '@/types'
import { allEntities } from '@/queries'

const INITIAL_ENTITIES_DATA = { categories: [], accounts: [], payment_methods: [], groups: [] }

const Context = createContext<{ entities: Entities } | null>(null)

export const useGlobalState = () => {
   const context = useContext(Context)
   if (!context) throw Error('Context is used out of scope')

   return context
}

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
   const { data: { data: entities = INITIAL_ENTITIES_DATA } = {}, isLoading } = useQuery({
      queryKey: ['entities'],
      queryFn: allEntities,
   })

   if (isLoading)
      return (
         <Center h={200}>
            <Loader />
         </Center>
      )
   return <Context.Provider value={{ entities }}>{children}</Context.Provider>
}
