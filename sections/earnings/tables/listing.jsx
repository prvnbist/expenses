import React from 'react'

import { formatDate, formatCurrency } from '../../../utils'

import { Table } from '../../../components'

export const Listing = ({ loading, earnings }) => {
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
            {earnings.map((earning, index) => (
               <Table.Row
                  key={earning.id}
                  isEven={(index & 1) === 1}
                  className={`${(index & 1) === 1 ? 'bg-gray-100' : ''}`}
               >
                  <Table.Cell as="td">{earning.source}</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {formatCurrency(earning.amount)}
                  </Table.Cell>
                  <Table.Cell as="td">{earning.category}</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {formatDate(earning.date)}
                  </Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}
