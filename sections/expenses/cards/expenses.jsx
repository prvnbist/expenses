import { useMutation } from '@apollo/react-hooks'

import { formatDate } from '../../../utils'

import { DELETE_EXPENSES } from '../../../graphql'

import { DeleteIcon } from '../../../assets/icons'
import { useConfig } from '../../../context'

export const Cards = ({ loading, expenses }) => {
   const { methods } = useConfig()
   const [deleteExpenses] = useMutation(DELETE_EXPENSES)
   if (loading) return <div>Loading...</div>
   return (
      <ul className="mt-3 divide-y border rounded-md">
         {expenses.map(expense => (
            <li key={expense.id} className="p-3">
               <header className="flex flex-col justify-between">
                  <h2 className="mb-3 text-xl">{expense.title}</h2>
                  <div className="flex items-center justify-between">
                     <time className="text-teal-500">
                        {formatDate(expense.date)}
                     </time>
                     <span className="font-medium text-red-600">
                        - {methods.format_currency(expense.amount)}
                     </span>
                  </div>
               </header>
               <main className="flex justify-between mt-3 border-t pt-2">
                  <section className="flex items-center">
                     <h3 className="text-teal-500">{expense.category}</h3>
                     <span className="mx-2 font-bold text-gray-400">
                        &middot;
                     </span>
                     <h3 className="text-teal-500">
                        {expense?.payment_method}
                     </h3>
                  </section>
                  <section>
                     <button
                        onClick={() =>
                           deleteExpenses({
                              variables: { where: { id: { _eq: expense.id } } },
                           })
                        }
                        className="ml-2 border rounded p-1 hover:bg-red-500 group"
                     >
                        <DeleteIcon className="stroke-current text-gray-500 group-hover:text-white" />
                     </button>
                  </section>
               </main>
            </li>
         ))}
      </ul>
   )
}
