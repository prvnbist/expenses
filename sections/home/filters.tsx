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

   if (is_loading) return null
   return (
      <section tw="mt-[-1px] border-t border-b border-dark-200 flex items-center justify-between h-10 md:(h-12)">
         <div tw="h-full">
            <button
               onClick={() => pagination.setPage(0)}
               disabled={!pagination.previousEnabled}
               tw="h-full px-3 border-l border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent)) md:(px-5)"
            >
               First
            </button>
            <button
               onClick={pagination.setPreviousPage}
               disabled={!pagination.previousEnabled}
               tw="h-full px-3 border-l border-r border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent)) md:(px-5)"
            >
               Prev
            </button>
         </div>
         <span>
            Page {pagination.currentPage + 1} of {pageCount + 1}
         </span>
         <div tw="h-full">
            <button
               onClick={pagination.setNextPage}
               disabled={!pagination.nextEnabled}
               tw="h-full px-3 border-l border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent)) md:(px-5)"
            >
               Next
            </button>
            <button
               disabled={!pagination.nextEnabled}
               onClick={() => pagination.setPage(pageCount)}
               tw="h-full px-3 border-l border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent)) md:(px-5)"
            >
               Last
            </button>
         </div>
      </section>
   )
}
