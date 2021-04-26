import React from 'react'
import { format } from 'date-fns'
import { useSubscription } from '@apollo/client'

import { SETTINGS } from '../graphql'

const ConfigContext = React.createContext()

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

export const ConfigProvider = ({ children }) => {
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

   const format_currency = amount =>
      new Intl.NumberFormat('en-US', {
         style: 'currency',
         currency: state.currency,
      }).format(amount)

   const format_date = date => format(new Date(date), state.date)

   return (
      <ConfigContext.Provider
         value={{ state, dispatch, methods: { format_currency, format_date } }}
      >
         {children}
      </ConfigContext.Provider>
   )
}

export const useConfig = () => React.useContext(ConfigContext)
