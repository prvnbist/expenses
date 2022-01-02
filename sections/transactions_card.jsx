import tw from 'twin.macro'

import * as Svg from '../assets/svgs'
import { useConfig } from '../context'
import * as Icon from '../assets/icons'
import { Button, Loader } from '../components'
import { useTransactions } from '../hooks/useTransactions'

export const CardView = ({ resetPage }) => {
   const { methods } = useConfig()
   const {
      remove,
      update,
      setWhere,
      is_loading,
      transactions,
      transactions_aggregate,
   } = useTransactions()

   const viewBy = (key, value) => {
      if (!value) return
      setWhere(existing => ({
         ...existing,
         [key]: { _eq: value },
      }))
   }

   if (is_loading)
      return (
         <div tw="mt-4">
            <Loader />
         </div>
      )
   if (transactions_aggregate?.aggregate?.count === 0)
      return (
         <div tw="my-6 w-full flex items-center justify-center">
            <Svg.Empty message="No transactions yet!" />
         </div>
      )
   return (
      <ul tw="p-3 space-y-2">
         {transactions.map(transaction => (
            <li key={transaction.id} tw="list-none border border-dark-200">
               <header tw="h-12 pl-3 flex items-center justify-between">
                  <h3 tw="text-lg">{transaction.title}</h3>
                  <aside tw="self-start h-10 border-l border-b border-dark-200 flex divide-x divide-dark-200">
                     <button
                        tw="h-10 w-10 flex items-center justify-center hover:(bg-dark-200)"
                        onClick={() => update(transaction)}
                     >
                        <Icon.Edit
                           size={16}
                           tw="stroke-current text-gray-300"
                        />
                     </button>
                     <button
                        tw="h-10 w-10 flex items-center justify-center hover:(bg-red-500)"
                        onClick={() =>
                           remove({ variables: { id: transaction.id } })
                        }
                     >
                        <Icon.Delete
                           size={16}
                           tw="stroke-current text-gray-300"
                        />
                     </button>
                  </aside>
               </header>
               <main tw="mt-3">
                  <section tw="px-3 mb-2 flex justify-between">
                     <span
                        title={
                           transaction.type === 'expense' ? 'Debit' : 'Credit'
                        }
                        css={[
                           tw`font-medium`,
                           transaction.type === 'expense'
                              ? tw`text-red-400`
                              : tw`text-indigo-400`,
                        ]}
                     >
                        {transaction.type === 'expense' ? '- ' : '+ '}
                        {methods.format_currency(
                           Number(transaction.amount) || 0
                        )}
                     </span>
                     <span tw="text-gray-400">
                        {methods.format_date(transaction.date)}
                     </span>
                  </section>
                  <section tw="h-10 flex items-center divide-x divide-dark-200 border-t border-dark-200 flex text-center">
                     <span
                        title="Category"
                        onClick={() => {
                           viewBy('category', transaction.category)
                           resetPage()
                        }}
                        tw="text-sm text-gray-400 h-full px-2 flex flex-wrap whitespace-nowrap flex-1 items-center justify-center cursor-pointer hover:(bg-dark-200)"
                     >
                        {transaction.category || 'N/A'}
                     </span>
                     <span
                        title="Payment Method"
                        onClick={() => {
                           viewBy('payment_method', transaction.payment_method)
                           resetPage()
                        }}
                        tw="text-sm text-gray-400 h-full px-2 flex flex-wrap whitespace-nowrap flex-1 items-center justify-center cursor-pointer hover:(bg-dark-200)"
                     >
                        {transaction.payment_method || 'N/A'}
                     </span>
                     <span
                        title="Account"
                        onClick={() => {
                           viewBy('account', transaction.account)
                           resetPage()
                        }}
                        tw="text-sm text-gray-400 h-full px-2 flex flex-wrap whitespace-nowrap flex-1 items-center justify-center cursor-pointer hover:(bg-dark-200)"
                     >
                        {transaction.account || 'N/A'}
                     </span>
                  </section>
               </main>
            </li>
         ))}
      </ul>
   )
}
