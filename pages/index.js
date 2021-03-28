import React from 'react'
import tw from 'twin.macro'
import { useSubscription } from '@apollo/client'

import { Layout } from '../sections'
import { useConfig } from '../context'
import { TRANSACTIONS } from '../graphql'
import { Table, TableLoader } from '../components'

const IndexPage = () => {
   const { methods } = useConfig()
   const [variables] = React.useState({
      order_by: { date: 'desc', title: 'asc' },
   })
   const {
      loading,
      data: { transactions = [] } = {},
   } = useSubscription(TRANSACTIONS, { variables })
   return (
      <Layout>
         <h1 tw="text-3xl mt-4 mb-3">Transactions</h1>
         <section tw="overflow-y-auto" style={{ maxHeight: '520px' }}>
            {loading ? (
               <TableLoader />
            ) : (
               <Table>
                  <Table.Head>
                     <Table.Row>
                        <Table.HCell>Title</Table.HCell>
                        <Table.HCell is_right>Credit</Table.HCell>
                        <Table.HCell is_right>Debit</Table.HCell>
                        <Table.HCell is_right>Date</Table.HCell>
                        <Table.HCell>Category</Table.HCell>
                        <Table.HCell>Payment Method</Table.HCell>
                     </Table.Row>
                  </Table.Head>
                  <Table.Body>
                     {transactions.map((transaction, index) => (
                        <Table.Row key={transaction.id} odd={index % 2 === 0}>
                           <Table.Cell>{transaction.title}</Table.Cell>
                           <Table.Cell is_right>
                              <span tw="font-medium text-indigo-400">
                                 {transaction.type === 'income'
                                    ? '+ ' +
                                      methods.format_currency(
                                         Number(transaction.amount) || 0
                                      )
                                    : ''}
                              </span>
                           </Table.Cell>
                           <Table.Cell is_right>
                              <span tw="font-medium text-red-400">
                                 {transaction.type === 'expense'
                                    ? '- ' +
                                      methods.format_currency(
                                         Number(transaction.amount) || 0
                                      )
                                    : ''}
                              </span>
                           </Table.Cell>
                           <Table.Cell is_right>
                              {methods.format_date(transaction.date)}
                           </Table.Cell>
                           <Table.Cell>
                              {transaction.category?.title || ''}
                           </Table.Cell>
                           <Table.Cell>
                              {transaction.payment_method?.title || ''}
                           </Table.Cell>
                        </Table.Row>
                     ))}
                  </Table.Body>
               </Table>
            )}
         </section>
      </Layout>
   )
}

export default IndexPage
