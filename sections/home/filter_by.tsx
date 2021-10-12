import React from 'react'
import tw from 'twin.macro'

import * as Icon from '../../assets/icons'
import { useTransactions } from '../../hooks'

export const FilterBy = (): JSX.Element => {
   const { where, setWhere } = useTransactions()

   if (
      Object.keys(where).filter(key => !Array.isArray(where[key])).length === 0
   )
      return null
   return (
      <section tw="mt-[-1px] h-auto border-t border-b border-gray-700 flex flex-col md:(h-12 divide-x divide-gray-700 flex-row)">
         <h3 tw="px-3 h-10 md:(h-12) flex items-center">Filter By</h3>
         <ul tw="h-12 pl-3 flex items-center flex-wrap gap-2">
            {Object.keys(where).map(
               key =>
                  !Array.isArray(where[key]) && (
                     <li
                        key={key}
                        title={key}
                        tw="h-8 flex space-x-2 items-center bg-gray-700 px-2 rounded"
                     >
                        <span>{where[key]?._eq}</span>
                        <button
                           onClick={() =>
                              setWhere(existing => {
                                 delete existing[key]
                                 return { ...existing }
                              })
                           }
                           tw="rounded-full p-1 hover:(bg-gray-800)"
                        >
                           <Icon.Close
                              size={16}
                              tw="stroke-current cursor-pointer"
                           />
                        </button>
                     </li>
                  )
            )}
         </ul>
      </section>
   )
}
