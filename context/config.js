import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { SETTINGS } from '../graphql'

const ConfigContext = React.createContext()

const initialState = {
   currency: 'INR',
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_CURRENCY':
         return { ...state, currency: payload }
      default:
         return state
   }
}

export const ConfigProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   useSubscription(SETTINGS, {
      onSubscriptionData: ({ subscriptionData: { data = {} } = {} }) => {
         const { settings } = data
         if (settings.length > 0) {
            dispatch({ type: 'SET_CURRENCY', payload: settings[0].value })
         }
      },
   })

   const format_currency = amount =>
      new Intl.NumberFormat('en-US', {
         style: 'currency',
         currency: state.currency,
      }).format(amount)

   return (
      <ConfigContext.Provider
         value={{ state, dispatch, methods: { format_currency } }}
      >
         {children}
      </ConfigContext.Provider>
   )
}

export const useConfig = () => React.useContext(ConfigContext)
