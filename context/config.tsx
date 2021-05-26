import React from 'react'
import { format } from 'date-fns'
import { useSubscription } from '@apollo/client'

import { SETTINGS } from '../graphql'

const ConfigContext = React.createContext(null)

const initialState = {
   currency: 'INR',
   date: 'MMM dd, yyyy',
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_CURRENCY':
         return { ...state, currency: payload }
      case 'SET_DATE':
         return { ...state, date: payload }
      default:
         return state
   }
}
interface IConfigProvider {
   children: React.ReactNode
}

export const ConfigProvider = ({ children }: IConfigProvider): JSX.Element => {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   useSubscription(SETTINGS, {
      onSubscriptionData: ({
         subscriptionData: { data: { settings = [] } = {} } = {},
      }) => {
         const currencyIndex = settings.findIndex(
            setting => setting.type === 'currency'
         )
         const dateIndex = settings.findIndex(
            setting => setting.type === 'date'
         )
         if (currencyIndex !== -1) {
            dispatch({
               type: 'SET_CURRENCY',
               payload: settings[currencyIndex].value,
            })
         }
         if (dateIndex !== -1) {
            dispatch({ type: 'SET_DATE', payload: settings[dateIndex].value })
         }
      },
   })

   const format_currency = (amount: number): string =>
      new Intl.NumberFormat('en-US', {
         style: 'currency',
         currency: state.currency,
      }).format(amount)

   const format_date = (date: string): string =>
      format(new Date(date), state.date)

   const format_k = (num: number): number | string => {
      return Math.abs(num) > 999
         ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'k'
         : Math.sign(num) * Math.abs(num)
   }

   return (
      <ConfigContext.Provider
         value={{
            state,
            dispatch,
            methods: { format_currency, format_date, format_k },
         }}
      >
         {children}
      </ConfigContext.Provider>
   )
}

export const useConfig = () => React.useContext(ConfigContext)
