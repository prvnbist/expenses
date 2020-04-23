import { formatDate, formatCurrency } from '../../../utils'

export const Cards = ({ loading, earnings }) => {
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
                        {formatCurrency(earning.amount)}
                     </span>
                  </div>
               </header>
               <main className="flex mt-3 border-t pt-2">
                  <time className="text-teal-500">
                     {formatDate(earning.date)}
                  </time>
               </main>
            </li>
         ))}
      </ul>
   )
}
