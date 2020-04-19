import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { EARNINGS } from '../queries'

import { formatDate, formatCurrency } from '../utils'

export const Earnings = () => {
   const { loading, error, data: { earnings = [] } = {} } = useQuery(EARNINGS)

   const columns = [
      {
         key: 'Source',
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
         type: 'Date',
      },
   ]

   if (loading) return <div>Loading...</div>
   if (error) return <div>{error.message}</div>
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
            {earnings.map((earning, index) => (
               <tr
                  key={earning.id}
                  className={`${(index & 1) === 1 ? 'bg-gray-100' : ''}`}
               >
                  <td className="border px-4 py-2">{earning.source}</td>
                  <td className="border px-4 py-2 text-right">
                     {formatCurrency(earning.amount)}
                  </td>
                  <td className="border px-4 py-2">{earning.category}</td>
                  <td className="border px-4 py-2 text-right">
                     {formatDate(earning.date)}
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   )
}
