import { useQuery } from '@apollo/react-hooks'

import { TOTAL_EXPENSES } from '../queries'
import { formatCurrency } from '../utils'

export const ExpensesMetrics = () => {
   const { data, loading } = useQuery(TOTAL_EXPENSES)

   const columns = [
      {
         key: 'Title',
         type: 'String',
      },
      {
         key: 'Value',
         type: 'Number',
      },
   ]
   return (
      <table className="w-full table-auto">
         <thead>
            <tr>
               {columns.map((column, index) => (
                  <th
                     key={index}
                     className={`px-4 py-2 uppercase text-gray-600 font-medium text-sm tracking-wider ${
                        column.type === 'String' ? 'text-left' : 'text-right'
                     }`}
                  >
                     {column.key}
                  </th>
               ))}
            </tr>
         </thead>
         <tbody>
            <tr>
               <td className="border px-4 py-2">Expenses Count</td>
               <td className="border px-4 py-2 text-right">
                  {data?.total_expenses.aggregate.count}
               </td>
            </tr>
            <tr className="bg-gray-100">
               <td className="border px-4 py-2">Average Spending</td>
               <td className="border px-4 py-2 text-right">
                  {formatCurrency(
                     data?.total_expenses.aggregate.avg.amount.toFixed(2)
                  )}
               </td>
            </tr>
            <tr>
               <td className="border px-4 py-2">Maximum Spending</td>
               <td className="border px-4 py-2 text-right">
                  {formatCurrency(
                     data?.total_expenses.aggregate.max.amount.toFixed(2)
                  )}
               </td>
            </tr>
            <tr>
               <td className="border px-4 py-2">Minimum Spending</td>
               <td className="border px-4 py-2 text-right">
                  {formatCurrency(
                     data?.total_expenses.aggregate.min.amount.toFixed(2)
                  )}
               </td>
            </tr>
         </tbody>
      </table>
   )
}
