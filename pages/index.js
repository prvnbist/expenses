import React from 'react'
import tw from 'twin.macro'
import { usePagination } from 'react-use-pagination'

import { Button } from '../components'
import * as Icon from '../assets/icons'
import { useTransactions } from '../hooks/useTransactions'
import { Layout, Form, TableView, CardView } from '../sections'

const IndexPage = () => {
   const [keyword, setKeyword] = React.useState('')
   const {
      limit,
      onSearch,
      isFormOpen,
      setIsFormOpen,
      transactions_aggregate,
   } = useTransactions()

   const pagination = usePagination({
      totalItems: transactions_aggregate?.aggregate?.count || 0,
      initialPageSize: limit,
   })

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
         <Filters pagination={pagination} />
         <FilterBy />
         <section
            style={{ maxHeight: '520px' }}
            tw="hidden md:block overflow-y-auto"
         >
            <TableView />
         </section>
         <section tw="md:hidden">
            <CardView />
         </section>
         <Filters pagination={pagination} />
         <AddTransaction />
      </Layout>
   )
}

export default IndexPage

const Filters = ({ pagination }) => {
   const {
      limit,
      setOffset,
      is_loading,
      transactions_aggregate,
   } = useTransactions()

   React.useEffect(() => {
      setOffset(pagination.startIndex)
   }, [pagination.startIndex])

   const pageCount = Math.floor(
      transactions_aggregate?.aggregate?.count / limit
   )
   const handlePageChange = e => {
      const { value } = e.target
      if (Number(value) < 0 || Number(value) > pageCount) return

      pagination.setPage(Number(e.target.value))
   }

   if (is_loading) return null
   return (
      <section tw="mt-3 mb-2 flex items-center justify-between">
         <span tw="flex items-center">
            Page{' '}
            <fieldset tw="mx-2">
               <input
                  type="text"
                  id="current_page"
                  name="current_page"
                  placeholder="Ex. 9"
                  onChange={handlePageChange}
                  value={pagination.currentPage}
                  tw="text-center w-10 bg-gray-700 h-10 rounded px-2"
               />
            </fieldset>
            of&nbsp;
            {pageCount || 0}
         </span>
         <Button.Group>
            <Button.Text
               onClick={pagination.setPreviousPage}
               disabled={!pagination.previousEnabled}
            >
               Prev
            </Button.Text>
            <Button.Text
               onClick={pagination.setNextPage}
               disabled={!pagination.nextEnabled}
            >
               Next
            </Button.Text>
         </Button.Group>
      </section>
   )
}

const FilterBy = () => {
   const { where, setWhere } = useTransactions()

   return (
      <section tw="mt-2 mb-3 flex items-center space-x-2">
         <h3 tw="font-normal text-sm uppercase tracking-wider">Filter By:</h3>
         <ul tw="flex flex-wrap gap-2">
            {Object.keys(where).map(
               key =>
                  !Array.isArray(where[key]) && (
                     <li
                        key={key}
                        title={key}
                        tw="flex space-x-2 items-center bg-gray-700 px-2 py-1 rounded"
                     >
                        <span>{where[key]?._eq}</span>
                        <button
                           onClick={() =>
                              setWhere(existing => {
                                 delete existing[key]
                                 return { ...existing }
                              })
                           }
                           tw="rounded-full p-1 hover:(bg-gray-800)"
                        >
                           <Icon.Close
                              size={16}
                              tw="stroke-current cursor-pointer"
                           />
                        </button>
                     </li>
                  )
            )}
         </ul>
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
