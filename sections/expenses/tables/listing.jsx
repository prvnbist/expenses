import React from 'react'
import tw from 'twin.macro'
import { useMutation } from '@apollo/react-hooks'

import { formatDate } from '../../../utils'

import { Table } from '../../../components'

import { DELETE_EXPENSES } from '../../../graphql'

import { DeleteIcon, CaretUp, CaretDown, Disable } from '../../../assets/icons'
import { useConfig } from '../../../context'

export const Listing = ({ loading, expenses, sort, setSort }) => {
   const { methods } = useConfig()
   const [deleteExpenses] = useMutation(DELETE_EXPENSES)
   const columns = [
      {
         key: 'Title',
         type: 'String',
         sort: true,
         field: 'title',
      },
      {
         key: 'Amount',
         type: 'Number',
         sort: true,
         field: 'amount',
      },
      {
         key: 'Category',
         type: 'String',
      },
      {
         key: 'Date',
         type: 'Date',
         sort: true,
         field: 'date',
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

   return (
      <Table>
         <Table.Head>
            <Table.Row>
               {columns.map((column, index) => (
                  <Table.Cell as="th" key={index} type={column.type}>
                     {column.sort ? (
                        <section
                           css={[
                              tw`flex items-center`,
                              ['Number', 'Date'].includes(column.type)
                                 ? tw`justify-end`
                                 : '',
                           ]}
                        >
                           {column.key}
                           {sort[column.field] === 'asc' && (
                              <button
                                 tw="ml-2 bg-gray-200 border-gray-300 rounded h-6 w-6 inline-flex items-center justify-center"
                                 onClick={() =>
                                    setSort({
                                       ...sort,
                                       [column.field]: 'desc',
                                    })
                                 }
                              >
                                 <CaretUp tw="stroke-current" />
                              </button>
                           )}
                           {sort[column.field] === 'desc' && (
                              <button
                                 tw="ml-2 bg-gray-200 border-gray-300 rounded h-6 w-6 inline-flex items-center justify-center"
                                 onClick={() =>
                                    setSort({
                                       ...sort,
                                       [column.field]: undefined,
                                    })
                                 }
                              >
                                 <CaretDown tw="stroke-current" />
                              </button>
                           )}
                           {sort[column.field] === undefined && (
                              <button
                                 tw="ml-2 bg-gray-200 border-gray-300 rounded h-6 w-6 inline-flex items-center justify-center"
                                 onClick={() =>
                                    setSort({
                                       ...sort,
                                       [column.field]: 'asc',
                                    })
                                 }
                              >
                                 <Disable tw="stroke-current" />
                              </button>
                           )}
                        </section>
                     ) : (
                        column.key
                     )}
                  </Table.Cell>
               ))}
            </Table.Row>
         </Table.Head>
         {loading ? (
            <Table.Body>
               {[
                  false,
                  true,
                  false,
                  true,
                  false,
                  true,
                  false,
                  true,
                  false,
                  true,
               ].map((node, index) => (
                  <Table.Row isEven={node} key={index}>
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                  </Table.Row>
               ))}
            </Table.Body>
         ) : (
            <Table.Body>
               {expenses.length > 0 ? (
                  expenses.map((expense, index) => (
                     <Table.Row key={expense.id} isEven={(index & 1) === 1}>
                        <Table.Cell as="td">{expense.title}</Table.Cell>
                        <Table.Cell as="td" align="right">
                           <span tw="font-medium text-red-600">
                              - {methods.format_currency(expense.amount)}
                           </span>
                        </Table.Cell>
                        <Table.Cell as="td">
                           <span tw="border border-teal-300 bg-teal-200 text-teal-600 px-1 text-sm rounded">
                              {expense.category}
                           </span>
                        </Table.Cell>
                        <Table.Cell as="td" align="right">
                           {formatDate(expense.date)}
                        </Table.Cell>
                        <Table.Cell as="td">
                           {expense.payment_method}
                        </Table.Cell>
                        <Table.Cell as="td" align="center">
                           <button
                              onClick={() =>
                                 deleteExpenses({
                                    variables: {
                                       where: { id: { _eq: expense.id } },
                                    },
                                 })
                              }
                              className="group"
                              tw="border rounded p-1 hover:bg-red-500"
                           >
                              <DeleteIcon tw="stroke-current text-gray-500 group-hover:text-white" />
                           </button>
                        </Table.Cell>
                     </Table.Row>
                  ))
               ) : (
                  <h3 tw="text-center my-3">No data</h3>
               )}
            </Table.Body>
         )}
      </Table>
   )
}
