import React from 'react'
import tw from 'twin.macro'

import * as Icon from '../../assets/icons'
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
      <section tw="mt-[-1px] border-t border-b border-dark-200 flex items-center justify-between h-10">
         <div tw="h-full flex">
            <button
               title="First"
               onClick={() => pagination.setPage(0)}
               disabled={!pagination.previousEnabled}
               tw="h-full w-10 flex items-center justify-center border-l border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent))"
            >
               <Icon.ChevronsLeft tw="stroke-current" />
            </button>
            <button
               title="Previous"
               onClick={pagination.setPreviousPage}
               disabled={!pagination.previousEnabled}
               tw="h-full w-10 flex items-center justify-center border-l border-r border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent))"
            >
               <Icon.ChevronLeft tw="stroke-current" />
            </button>
         </div>
         <span tw="text-sm">
            Page {pagination.currentPage + 1} of {pageCount + 1}
         </span>
         <div tw="h-full flex">
            <button
               title="Next"
               onClick={pagination.setNextPage}
               disabled={!pagination.nextEnabled}
               tw="h-full w-10 flex items-center justify-center border-l border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent))"
            >
               <Icon.ChevronRight tw="stroke-current" />
            </button>
            <button
               title="Last"
               disabled={!pagination.nextEnabled}
               onClick={() => pagination.setPage(pageCount)}
               tw="h-full w-10 flex items-center justify-center border-l border-dark-200 hover:(bg-dark-200) disabled:(cursor-not-allowed text-gray-400 hover:(bg-transparent))"
            >
               <Icon.ChevronsRight tw="stroke-current" />
            </button>
         </div>
      </section>
   )
}
