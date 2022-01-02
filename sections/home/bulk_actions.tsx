import React from 'react'
import tw from 'twin.macro'

import * as Icon from '../../assets/icons'
import { useTransactions } from '../../hooks/useTransactions'

export const BulkActions = (): JSX.Element => {
   const { selected, bulk } = useTransactions()

   if (selected.length === 0) return null
   return (
      <section tw="mt-[-1px] h-auto border-t border-b border-dark-200 flex-col hidden md:(h-12 divide-x divide-dark-200 flex-row flex)">
         <h2 tw="px-3 h-10 md:(h-12) flex items-center">
            Bulk Actions
            {selected.length > 0 && (
               <span tw="text-gray-400">({selected.length} selected)</span>
            )}
         </h2>
         <aside tw="ml-auto flex border-dark-200 h-12 divide-x divide-gray-700 md:(h-full border-l)">
            <button
               onClick={bulk.delete}
               tw="flex items-center justify-center flex-1 h-12 pr-5 md:(justify-start) hover:(bg-red-500)"
            >
               <span tw="h-12 w-12 flex items-center justify-center">
                  <Icon.Delete tw="stroke-current" />
               </span>
               Delete
            </button>
            <button
               onClick={bulk.reset}
               tw="flex items-center justify-center md:(justify-start) flex-1 h-12 px-5 hover:(bg-dark-200)"
            >
               Clear
            </button>
         </aside>
      </section>
   )
}
