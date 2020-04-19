import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { EXPENSES } from '../queries'

import { formatDate, formatCurrency } from '../utils'

export const Expenses = () => {
   const { loading, error, data: { expenses = [] } = {} } = useQuery(EXPENSES)

   const columns = [
      {
         key: 'Title',
         type: 'String',
      },
      {
         key: 'Amount',
         type: 'Number',
      },
      {
         key: 'Category',
         type: 'String',
      },
      {
         key: 'Date',
         type: 'String',
      },
      {
         key: 'Payment Method',
         type: 'String',
      },
   ]

   if (loading) <div>Loading...</div>
   if (error) <div>{error.message}</div>
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
            {expenses.map((expense, index) => (
               <tr
                  key={index}
                  className={`${(index & 1) === 1 ? 'bg-gray-100' : ''}`}
               >
                  <td className="border px-4 py-2">{expense.title}</td>
                  <td className="border px-4 py-2 text-right">
                     {formatCurrency(expense.amount)}
                  </td>
                  <td className="border px-4 py-2">{expense.category}</td>
                  <td className="border px-4 py-2">
                     {formatDate(expense.date)}
                  </td>
                  <td className="border px-4 py-2">{expense.payment_method}</td>
               </tr>
            ))}
         </tbody>
      </table>
   )
}
