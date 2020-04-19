import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { EXPENSES } from '../queries'

import { formatDate, formatCurrency } from '../utils'

import { Table } from '../components'

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
         type: 'Date',
      },
      {
         key: 'Payment Method',
         type: 'String',
      },
   ]

   if (loading) return <div>Loading...</div>
   if (error) return <div>{error.message}</div>
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
                     {formatCurrency(expense.amount)}
                  </Table.Cell>
                  <Table.Cell as="td">{expense.category}</Table.Cell>
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
