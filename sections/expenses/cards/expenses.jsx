import tw from 'twin.macro'
import { useMutation } from '@apollo/react-hooks'

import { DELETE_EXPENSES } from '../../../graphql'

import { DeleteIcon } from '../../../assets/icons'
import { useConfig } from '../../../context'

export const Cards = ({ loading, expenses }) => {
   const { methods } = useConfig()
   const [deleteExpenses] = useMutation(DELETE_EXPENSES)
   if (loading) return <div>Loading...</div>
   return (
      <ul tw="mt-3 divide-y border rounded-md">
         {expenses.map(expense => (
            <li key={expense.id} tw="p-3">
               <header tw="flex flex-col justify-between">
                  <h2 tw="mb-3 text-xl">{expense.title}</h2>
                  <div tw="flex items-center justify-between">
                     <time tw="text-teal-500">
                        {methods.format_date(expense.date)}
                     </time>
                     <span tw="font-medium text-red-600">
                        - {methods.format_currency(expense.amount)}
                     </span>
                  </div>
               </header>
               <main tw="flex justify-between mt-3 border-t pt-2">
                  <section tw="flex items-center">
                     <h3 tw="text-teal-500">{expense.category}</h3>
                     <span tw="mx-2 font-bold text-gray-400">&middot;</span>
                     <h3 tw="text-teal-500">{expense?.payment_method}</h3>
                  </section>
                  <section>
                     <button
                        onClick={() =>
                           deleteExpenses({
                              variables: { where: { id: { _eq: expense.id } } },
                           })
                        }
                        className="group"
                        tw="ml-2 border rounded p-1 hover:bg-red-500"
                     >
                        <DeleteIcon tw="stroke-current text-gray-500 group-hover:text-white" />
                     </button>
                  </section>
               </main>
            </li>
         ))}
      </ul>
   )
}
