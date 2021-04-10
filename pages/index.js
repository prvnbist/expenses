import React from 'react'
import tw from 'twin.macro'
import { useMutation, useSubscription } from '@apollo/client'

import { useConfig } from '../context'
import { Button } from '../components'
import * as Icon from '../assets/icons'
import { Layout, Form, TableView, CardView } from '../sections'
import {
   TRANSACTIONS,
   DELETE_TRANSACTION,
   TRANSACTIONS_AGGREGATE,
} from '../graphql'

const IndexPage = () => {
   const { methods } = useConfig()
   const [open, toggle] = React.useState(false)
   const [edit, setEdit] = React.useState({})
   const [keyword, setKeyword] = React.useState('')
   const [variables, setVariables] = React.useState({
      order_by: { raw_date: 'desc', title: 'asc' },
      offset: 0,
      limit: 10,
   })
   const {
      loading: loading_aggregate,
      data: { transactions_aggregate = {} } = {},
   } = useSubscription(TRANSACTIONS_AGGREGATE)
   const {
      loading,
      data: { transactions = [] } = {},
   } = useSubscription(TRANSACTIONS, { variables })
   const [remove] = useMutation(DELETE_TRANSACTION, {
      onError: error => console.log('delete -> error ->', error),
   })

   const update = transaction => {
      setEdit(transaction)
      toggle(true)
   }

   const onSearch = keyword => {
      setVariables(existing => ({
         ...existing,
         where: {
            ...existing.where,
            _or: [
               { title: { _ilike: `%${keyword}%` } },
               { account: { title: { _ilike: `%${keyword}%` } } },
               { payment_method: { title: { _ilike: `%${keyword}%` } } },
               { category: { title: { _ilike: `%${keyword}%` } } },
            ],
         },
      }))
   }

   const prevPage = () => {
      if (variables.offset - 10 < 0) return
      setVariables(existing => ({
         ...existing,
         offset: existing.offset - 10,
      }))
   }
   const nextPage = () => {
      if (variables.offset + 10 > transactions_aggregate?.aggregate?.count)
         return
      setVariables(existing => ({
         ...existing,
         offset: existing.offset + 10,
      }))
   }

   const goto = e => {
      const page = e.target.value || 0
      setVariables(existing => ({
         ...existing,
         offset: Number(page) * existing.limit,
      }))
   }

   return (
      <Layout>
         <header tw="flex items-center justify-between">
            <h1 tw="text-3xl mt-4 mb-3">Transactions</h1>
            <Button.Icon onClick={() => toggle(!open)}>
               <Icon.Add tw="stroke-current" />
            </Button.Icon>
         </header>
         <section tw="mt-3 mb-2">
            <fieldset>
               <input
                  type="text"
                  name="search"
                  id="search"
                  value={keyword}
                  placeholder="Enter your search"
                  onChange={e => {
                     setKeyword(e.target.value)
                     onSearch(e.target.value)
                  }}
                  tw="bg-gray-700 h-10 rounded px-2"
               />
            </fieldset>
         </section>
         {!loading && !loading_aggregate && (
            <Filters
               goto={goto}
               nextPage={nextPage}
               prevPage={prevPage}
               variables={variables}
               transactions_aggregate={transactions_aggregate}
            />
         )}
         <section
            style={{ maxHeight: '520px' }}
            tw="hidden md:block overflow-y-auto"
         >
            <TableView
               is_loading={loading}
               remove={remove}
               update={update}
               methods={methods}
               transactions={transactions}
            />
         </section>
         <section tw="md:hidden">
            <CardView
               is_loading={loading}
               remove={remove}
               update={update}
               methods={methods}
               transactions={transactions}
            />
         </section>
         {!loading && !loading_aggregate && (
            <Filters
               goto={goto}
               nextPage={nextPage}
               prevPage={prevPage}
               variables={variables}
               transactions_aggregate={transactions_aggregate}
            />
         )}
         {open && (
            <AddTransaction edit={edit} setEdit={setEdit} toggle={toggle} />
         )}
      </Layout>
   )
}

export default IndexPage

const Filters = ({
   goto,
   variables,
   transactions_aggregate,
   nextPage,
   prevPage,
}) => {
   return (
      <section tw="mt-3 mb-2 flex items-center justify-between">
         <span tw="flex items-center">
            Page{' '}
            <fieldset tw="mx-2">
               <input
                  type="text"
                  onChange={goto}
                  id="current_page"
                  name="current_page"
                  placeholder="Ex. 9"
                  value={Math.ceil(variables.offset / variables.limit)}
                  tw="text-center w-10 bg-gray-700 h-10 rounded px-2"
               />
            </fieldset>
            of{' '}
            {Math.ceil(
               transactions_aggregate?.aggregate?.count / variables.limit
            ) || 0}
         </span>
         <Button.Group>
            <Button.Text
               onClick={prevPage}
               disabled={variables.offset - 10 < 0}
            >
               Prev
            </Button.Text>
            <Button.Text
               onClick={nextPage}
               disabled={
                  variables.offset + 10 >
                  transactions_aggregate?.aggregate?.count
               }
            >
               Next
            </Button.Text>
         </Button.Group>
      </section>
   )
}

const AddTransaction = ({ edit, setEdit, toggle }) => {
   return (
      <section tw="fixed left-0 top-0 bottom-0 z-10 bg-gray-800 shadow-xl w-screen md:w-6/12 lg:w-5/12 xl:w-4/12">
         <header tw="flex items-center justify-between px-3 h-16 border-b border-gray-700">
            <h1 tw="text-xl">Add Transactions</h1>
            <Button.Icon
               onClick={() => {
                  setEdit({})
                  toggle(!open)
               }}
            >
               <Icon.Close tw="stroke-current" />
            </Button.Icon>
         </header>
         <main tw="px-3">
            <Form close={toggle} transaction={edit} setEdit={setEdit} />
         </main>
      </section>
   )
}
