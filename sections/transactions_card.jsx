import tw from 'twin.macro'
import * as Svg from '../assets/svgs'
import { useConfig } from '../context'
import * as Icon from '../assets/icons'
import { Button, Loader } from '../components'
import { useTransactions } from '../hooks/useTransactions'

export const CardView = () => {
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

   if (is_loading) return <Loader />
   if (transactions_aggregate?.aggregate?.count === 0)
      return (
         <div tw="my-6 w-full flex items-center justify-center">
            <Svg.Empty message="No transactions yet!" />
         </div>
      )
   return (
      <ul tw="space-y-2">
         {transactions.map(transaction => (
            <li key={transaction.id} tw="list-none bg-gray-700 rounded p-3">
               <header tw="flex items-center justify-between">
                  <h3 tw="text-lg">{transaction.title}</h3>
                  <Button.Group>
                     <Button.Icon is_small onClick={() => update(transaction)}>
                        <Icon.Edit size={16} tw="stroke-current" />
                     </Button.Icon>
                     <Button.Icon is_small>
                        <Icon.Delete
                           size={16}
                           tw="stroke-current"
                           onClick={() =>
                              remove({
                                 variables: { id: transaction.id },
                              })
                           }
                        />
                     </Button.Icon>
                  </Button.Group>
               </header>
               <main tw="mt-3">
                  <section tw="mb-2 flex justify-between">
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
                     <span>{methods.format_date(transaction.date)}</span>
                  </section>
                  <section tw="pt-2 divide-x divide-gray-800 border-t border-gray-800 grid grid-cols-3 text-center">
                     <span
                        title="Category"
                        tw="cursor-pointer"
                        onClick={() => viewBy('category', transaction.category)}
                     >
                        {transaction.category || 'N/A'}
                     </span>
                     <span
                        title="Payment Method"
                        tw="cursor-pointer"
                        onClick={() =>
                           viewBy('payment_method', transaction.payment_method)
                        }
                     >
                        {transaction.payment_method || 'N/A'}
                     </span>
                     <span
                        title="Account"
                        tw="cursor-pointer"
                        onClick={() => viewBy('account', transaction.account)}
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
