import { formatDate, formatCurrency } from '../../../utils'

export const Cards = ({ loading, expenses }) => {
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
               <main className="flex mt-3 border-t pt-2">
                  <time className="text-teal-500">
                     {formatDate(expense.date)}
                  </time>
                  {expense.payment_method && (
                     <span className="mx-2 font-bold text-gray-400">
                        &middot;
                     </span>
                  )}
                  <h3 className="text-teal-500">{expense?.payment_method}</h3>
               </main>
            </li>
         ))}
      </ul>
   )
}
