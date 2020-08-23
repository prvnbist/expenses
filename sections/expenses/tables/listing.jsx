import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import { formatDate, formatCurrency } from '../../../utils'

import { Table } from '../../../components'

import { DELETE_EXPENSES } from '../../../graphql'

import { DeleteIcon } from '../../../assets/icons'

export const Listing = ({ loading, expenses }) => {
   const [deleteExpenses] = useMutation(DELETE_EXPENSES)
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
      {
         key: 'Actions',
         type: 'Actions',
      },
   ]

   if (loading) return <div>Loading...</div>
   if (expenses.length === 0)
      return <h3 className="text-center my-3">No data</h3>

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
                  <Table.Cell as="td" align="right">
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
                  </Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}
