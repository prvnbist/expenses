import React from 'react'

import { formatDate, formatCurrency } from '../../../utils'

import { Table } from '../../../components'

export const Listing = ({ loading, expenses }) => {
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
         type: 'Date',
      },
      {
         key: 'Payment Method',
         type: 'String',
      },
   ]

   if (loading) return <div>Loading...</div>
   return (
      <Table>
         <Table.Head>
            <Table.Row>
               {columns.map((column, index) => (
                  <Table.Cell as="th" key={index} type={column.type}>
                     {column.key}
                  </Table.Cell>
               ))}
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {expenses.map((expense, index) => (
               <Table.Row key={expense.id} isEven={(index & 1) === 1}>
                  <Table.Cell as="td">{expense.title}</Table.Cell>
                  <Table.Cell as="td" align="right">
                     <span className="font-medium text-red-600">
                        - {formatCurrency(expense.amount)}
                     </span>
                  </Table.Cell>
                  <Table.Cell as="td">
                     <span className="border border-teal-300 bg-teal-200 text-teal-600 px-1 text-sm rounded">
                        {expense.category}
                     </span>
                  </Table.Cell>
                  <Table.Cell as="td" align="right">
                     {formatDate(expense.date)}
                  </Table.Cell>
                  <Table.Cell as="td">{expense.payment_method}</Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}
