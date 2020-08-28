import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import { formatDate } from '../../../utils'

import { Table } from '../../../components'

import { DELETE_EARNINGS } from '../../../graphql'

import { DeleteIcon } from '../../../assets/icons'
import { useConfig } from '../../../context'

export const Listing = ({ loading, earnings }) => {
   const { methods } = useConfig()
   const [deleteEarnings] = useMutation(DELETE_EARNINGS)
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
      {
         type: 'Actions',
         type: 'Actions',
      },
   ]

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
               {earnings.length > 0 ? (
                  earnings.map((earning, index) => (
                     <Table.Row
                        key={earning.id}
                        isEven={(index & 1) === 1}
                        className={`${(index & 1) === 1 ? 'bg-gray-100' : ''}`}
                     >
                        <Table.Cell as="td">{earning.source}</Table.Cell>
                        <Table.Cell as="td" align="right">
                           <span className="font-medium text-blue-600">
                              + {methods.format_currency(earning.amount)}
                           </span>
                        </Table.Cell>
                        <Table.Cell as="td">
                           <span className="border border-teal-300 bg-teal-200 text-teal-600 px-1 text-sm rounded">
                              {earning.category}
                           </span>
                        </Table.Cell>
                        <Table.Cell as="td" align="right">
                           {formatDate(earning.date)}
                        </Table.Cell>
                        <Table.Cell as="td" align="right">
                           <button
                              onClick={() =>
                                 deleteEarnings({
                                    variables: {
                                       where: { id: { _eq: earning.id } },
                                    },
                                 })
                              }
                              className="ml-2 border rounded p-1 hover:bg-red-500 group"
                           >
                              <DeleteIcon className="stroke-current text-gray-500 group-hover:text-white" />
                           </button>
                        </Table.Cell>
                     </Table.Row>
                  ))
               ) : (
                  <h3 className="text-center my-3">No data</h3>
               )}
            </Table.Body>
         )}
      </Table>
   )
}
