import React from 'react'
import tw from 'twin.macro'
import { useSubscription } from '@apollo/client'

import { useConfig } from '../context'
import * as Icon from '../assets/icons'
import { TRANSACTIONS } from '../graphql'
import { Layout, Form } from '../sections'
import { Button, Table, TableLoader } from '../components'

const IndexPage = () => {
   const { methods } = useConfig()
   const [open, toggle] = React.useState(false)
   const [variables] = React.useState({
      order_by: { date: 'desc', title: 'asc' },
   })
   const {
      loading,
      data: { transactions = [] } = {},
   } = useSubscription(TRANSACTIONS, { variables })
   return (
      <Layout>
         <header tw="flex items-center justify-between">
            <h1 tw="text-3xl mt-4 mb-3">Transactions</h1>
            <Button.Icon onClick={() => toggle(!open)}>
               <Icon.Add tw="stroke-current" />
            </Button.Icon>
         </header>
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
         {open && (
            <section tw="absolute left-0 top-0 bottom-0 z-10 bg-gray-800 shadow-xl w-screen md:w-6/12 lg:w-5/12 xl:w-4/12">
               <header tw="flex items-center justify-between px-3 h-16 border-b border-gray-700">
                  <h1 tw="text-xl">Add Transactions</h1>
                  <Button.Icon onClick={() => toggle(!open)}>
                     <Icon.Close tw="stroke-current" />
                  </Button.Icon>
               </header>
               <main tw="px-3">
                  <Form close={toggle} />
               </main>
            </section>
         )}
      </Layout>
   )
}

export default IndexPage
