import { useMutation } from '@apollo/react-hooks'

import { formatDate, formatCurrency } from '../../../utils'

import { DELETE_EARNINGS } from '../../../queries'

import { DeleteIcon } from '../../../assets/icons'

export const Cards = ({ loading, earnings }) => {
   const [deleteEarnings] = useMutation(DELETE_EARNINGS)
   if (loading) return <div>Loading...</div>
   return (
      <ul className="mt-3 divide-y border rounded-md">
         {earnings.map(earning => (
            <li key={earning.id} className="p-3">
               <header className="flex items-center justify-between">
                  <h2 className="text-xl">
                     {earning.source}
                     <span className="mx-2 font-bold text-gray-400">
                        &middot;
                     </span>
                     <span className="border border-teal-300 bg-teal-200 text-teal-600 px-1 text-sm rounded">
                        {earning.category}
                     </span>
                  </h2>
                  <div>
                     <span className="font-medium text-blue-600">
                        + {formatCurrency(earning.amount)}
                     </span>
                  </div>
               </header>
               <main className="flex justify-between mt-3 border-t pt-2">
                  <time className="text-teal-500">
                     {formatDate(earning.date)}
                  </time>
                  <section>
                     <button
                        onClick={() =>
                           deleteEarnings({
                              variables: { where: { id: { _eq: earning.id } } },
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
