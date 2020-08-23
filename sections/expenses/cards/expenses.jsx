import { useMutation } from '@apollo/react-hooks'

import { formatDate, formatCurrency } from '../../../utils'

import { DELETE_EXPENSES } from '../../../queries'

import { DeleteIcon } from '../../../assets/icons'

export const Cards = ({ loading, expenses }) => {
   const [deleteExpenses] = useMutation(DELETE_EXPENSES)
   if (loading) return <div>Loading...</div>
   return (
      <ul className="mt-3 divide-y border rounded-md">
         {expenses.map(expense => (
            <li key={expense.id} className="p-3">
               <header className="flex items-center justify-between">
                  <h2 className="text-xl">
                     {expense.title}
                     <span className="mx-2 font-bold text-gray-400">
                        &middot;
                     </span>
                     <span className="border border-teal-300 bg-teal-200 text-teal-600 px-1 text-sm rounded">
                        {expense.category}
                     </span>
                  </h2>
                  <div>
                     <span className="font-medium text-red-600">
                        - {formatCurrency(expense.amount)}
                     </span>
                  </div>
               </header>
               <main className="flex justify-between mt-3 border-t pt-2">
                  <section className="inline-flex">
                     <time className="text-teal-500">
                        {formatDate(expense.date)}
                     </time>
                     {expense.payment_method && (
                        <span className="mx-2 font-bold text-gray-400">
                           &middot;
                        </span>
                     )}
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
