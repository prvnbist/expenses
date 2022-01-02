import React from 'react'
import tw from 'twin.macro'

import { useTransactions, useOnClickOutside } from '../../hooks'

export const SortBy = (): JSX.Element => {
   const ref = React.useRef()
   const { on_sort, orderBy, setIsSortPanelOpen } = useTransactions()

   useOnClickOutside(ref, () => setIsSortPanelOpen(false))

   return (
      <ul
         ref={ref}
         tw="w-[280px] absolute right-[calc(50% - 140px)] md:right-[98px] mt-2 mr-0 z-10 bg-dark-200 py-2 rounded shadow-xl"
      >
         <SortByOption
            field="title"
            title="Title"
            on_sort={on_sort}
            active={orderBy?.title}
         />
         <SortByOption
            field="credit"
            title="Credit"
            on_sort={on_sort}
            active={orderBy?.credit}
         />
         <SortByOption
            field="debit"
            title="Debit"
            on_sort={on_sort}
            active={orderBy?.debit}
         />
         <SortByOption
            title="Date"
            field="raw_date"
            on_sort={on_sort}
            active={orderBy?.raw_date}
         />
         <SortByOption
            field="category"
            title="Category"
            on_sort={on_sort}
            active={orderBy?.category}
         />
         <SortByOption
            on_sort={on_sort}
            field="payment_method"
            title="Payment Method"
            active={orderBy?.payment_method}
         />
         <SortByOption
            title="Account"
            field="account"
            on_sort={on_sort}
            active={orderBy?.account}
         />
      </ul>
   )
}

interface ISortByOption {
   field: string
   title: string
   active: 'asc' | 'desc'
   on_sort: (x: string, y: 'asc' | 'desc') => void
}

const SortByOption = ({
   field,
   title,
   active,
   on_sort,
}: ISortByOption): JSX.Element => {
   return (
      <li tw="cursor-pointer flex items-center justify-between pl-3 pr-2 h-10 space-x-4">
         <span>{title}</span>
         <section tw="space-x-1">
            <button
               onClick={() => on_sort(field, 'asc')}
               css={[
                  tw`py-1 px-2 rounded text-sm hover:(bg-dark-300)`,
                  active === 'asc' && tw`bg-dark-300`,
               ]}
            >
               Asc
            </button>
            <button
               onClick={() => on_sort(field, 'desc')}
               css={[
                  tw`py-1 px-2 rounded text-sm hover:(bg-dark-300)`,
                  active === 'desc' && tw`bg-dark-300`,
               ]}
            >
               Desc
            </button>
         </section>
      </li>
   )
}
