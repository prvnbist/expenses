import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import { useUser } from './user'
import QUERIES from 'graphql/queries'

export interface ISettingContext {
   settings: {
      [key: string]: any
   }
}

const Context = React.createContext<ISettingContext | null>(null)

interface ISettingProviderProps {
   children: React.ReactNode
}

export const SettingProvider = ({
   children,
}: ISettingProviderProps): JSX.Element => {
   const router = useRouter()
   const { user } = useUser()
   const [settings, setSettings] = React.useState({
      excludeCategoriesFromTotalIncome: [],
   })
   useQuery(QUERIES.SETTINGS.LIST, {
      skip: !user?.id,
      variables: { where: { user_id: { _eq: user?.id } } },
      onCompleted: ({ settings = [] }) => {
         setSettings(
            settings.reduce((result: any, current: { [key: string]: any }) => {
               result[current.title] = current.value
               return result
            }, {})
         )
      },
      onError: () => {},
   })

   return <Context.Provider value={{ settings }}>{children}</Context.Provider>
}

export const useSetting = () => React.useContext(Context)
