import React from 'react'
import tw from 'twin.macro'

import { Button } from '../components'
import * as Icon from '../assets/icons'
import { useTransactions } from '../hooks/useTransactions'
import { Layout, Form, TableView, CardView } from '../sections'

const IndexPage = () => {
   const [keyword, setKeyword] = React.useState('')
   const { onSearch, isFormOpen, setIsFormOpen } = useTransactions()

   return (
      <Layout>
         <header tw="flex items-center justify-between">
            <h1 tw="text-3xl mt-4 mb-3">Transactions</h1>
            <Button.Icon onClick={() => setIsFormOpen(!isFormOpen)}>
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
         <Filters />
         <section
            style={{ maxHeight: '520px' }}
            tw="hidden md:block overflow-y-auto"
         >
            <TableView />
         </section>
         <section tw="md:hidden">
            <CardView />
         </section>
         <Filters />
         <AddTransaction />
      </Layout>
   )
}

export default IndexPage

const Filters = () => {
   const {
      goto,
      limit,
      offset,
      prevPage,
      nextPage,
      is_loading,
      transactions_aggregate,
   } = useTransactions()

   if (is_loading) return null
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
                  value={Math.ceil(offset / limit)}
                  tw="text-center w-10 bg-gray-700 h-10 rounded px-2"
               />
            </fieldset>
            of{' '}
            {Math.ceil(transactions_aggregate?.aggregate?.count / limit) || 0}
         </span>
         <Button.Group>
            <Button.Text onClick={prevPage} disabled={offset - 10 < 0}>
               Prev
            </Button.Text>
            <Button.Text
               onClick={nextPage}
               disabled={offset + 10 > transactions_aggregate?.aggregate?.count}
            >
               Next
            </Button.Text>
         </Button.Group>
      </section>
   )
}

const AddTransaction = () => {
   const { setEditForm, isFormOpen, setIsFormOpen } = useTransactions()

   if (!isFormOpen) return null
   return (
      <section tw="fixed left-0 top-0 bottom-0 z-10 bg-gray-800 shadow-xl w-screen md:w-6/12 lg:w-5/12 xl:w-4/12">
         <header tw="flex items-center justify-between px-3 h-16 border-b border-gray-700">
            <h1 tw="text-xl">Add Transactions</h1>
            <Button.Icon
               onClick={() => {
                  setEditForm({})
                  setIsFormOpen(!isFormOpen)
               }}
            >
               <Icon.Close tw="stroke-current" />
            </Button.Icon>
         </header>
         <main tw="px-3">
            <Form />
         </main>
      </section>
   )
}
