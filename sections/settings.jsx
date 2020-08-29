import React from 'react'
import tw from 'twin.macro'
import { useMutation } from '@apollo/react-hooks'

import { useConfig } from '../context'
import { UPDATE_SETTING } from '../graphql'
import currency_json from '../metadata/currencies.json'

export const Settings = ({ setIsSettingsVisible }) => {
   const [update] = useMutation(UPDATE_SETTING)
   const { state } = useConfig()
   return (
      <div tw="fixed inset-0 bg-tint sm:pt-40 flex items-start justify-center">
         <div tw="w-full h-full bg-white sm:w-11/12 sm:h-auto lg:w-7/12 xl:w-4/12  p-5 rounded-lg">
            <div tw="flex">
               <div tw="flex-1  flex items-center justify-between mr-3">
                  <h1>Settings</h1>
                  <button
                     onClick={() => setIsSettingsVisible(false)}
                     tw="text-2xl flex-shrink-0 rounded-lg w-10 h-10 border hover:bg-gray-300"
                  >
                     &times;
                  </button>
               </div>
            </div>
            <section tw="mt-3 flex flex-col">
               <label tw="text-sm mb-1 uppercase font-medium tracking-wider text-gray-500">
                  Currency
               </label>
               <select
                  name="currencies"
                  value={state.currency}
                  onChange={e =>
                     update({
                        variables: {
                           type: {
                              _eq: 'currency',
                           },
                           _set: {
                              value: e.target.value,
                           },
                        },
                     })
                  }
                  tw="border rounded py-2 px-1 focus:outline-none focus:border-indigo-400"
               >
                  {currency_json.map(currency => (
                     <option key={currency.value} value={currency.value}>
                        {currency.title}
                     </option>
                  ))}
               </select>
            </section>
         </div>
      </div>
   )
}
