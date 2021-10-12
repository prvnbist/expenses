import React from 'react'
import tw from 'twin.macro'

import { useTransactions } from '../../hooks'

interface PaginationState {
   currentPage: number
   startIndex: number
   endIndex: number
   nextEnabled: number
   previousEnabled: number
   pageSize: number
   setPage: (page: number) => void
   setNextPage: () => void
   setPreviousPage: () => void
   setPageSize: (pageSize: number, nextPage?: number) => void
}

interface IFilters {
   pagination: PaginationState
}

export const Filters = ({ pagination }: IFilters): JSX.Element => {
   const { limit, setOffset, is_loading, transactions_aggregate } =
      useTransactions()

   React.useEffect(() => {
      setOffset(pagination.startIndex)
   }, [pagination.startIndex])

   const pageCount = Math.floor(
      transactions_aggregate?.aggregate?.count / limit
   )
   const handlePageChange = e => {
      const { value } = e.target
      if (Number(value) < 0 || Number(value) > pageCount) return

      pagination.setPage(Number(e.target.value))
   }

   if (is_loading) return null
   return (
      <section tw="mt-[-1px] border-t border-b border-gray-700 flex h-12">
         <button
            onClick={pagination.setPreviousPage}
            disabled={!pagination.previousEnabled}
            tw="h-full px-5 border-r border-gray-700 hover:(bg-gray-700)"
         >
            Prev
         </button>
         <section tw="flex-1 flex justify-center">
            <span tw="flex items-center">
               Page{' '}
               <fieldset tw="mx-2">
                  <input
                     type="text"
                     id="current_page"
                     name="current_page"
                     placeholder="Ex. 9"
                     onChange={handlePageChange}
                     value={pagination.currentPage}
                     tw="text-center max-w-[64px] md:max-w-[120px] bg-gray-700 h-8 rounded px-2"
                  />
               </fieldset>
               of&nbsp;
               {pageCount || 0}
            </span>
         </section>

         <button
            onClick={pagination.setNextPage}
            disabled={!pagination.nextEnabled}
            tw="h-full px-5 border-l border-gray-700 hover:(bg-gray-700)"
         >
            Next
         </button>
      </section>
   )
}
