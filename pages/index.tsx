import React from 'react'
import tw from 'twin.macro'
import ReactModal from 'react-modal'
import { usePagination } from 'react-use-pagination'

import { Button } from '../components'
import * as Icon from '../assets/icons'
import { useTransactions } from '../hooks'
import { Layout, TableView, CardView } from '../sections'
import {
   Form,
   Export,
   SortBy,
   Filters,
   FilterBy,
   BulkActions,
   CurrentMonthExpenditure,
} from '../sections/home'

const IndexPage = (): JSX.Element => {
   const [keyword, setKeyword] = React.useState('')
   const {
      where,
      limit,
      onSearch,
      isFormOpen,
      setIsFormOpen,
      isSortPanelOpen,
      isExportPanelOpen,
      setIsSortPanelOpen,
      setIsExportPanelOpen,
      transactions_aggregate,
   } = useTransactions()

   const pagination = usePagination({
      initialPageSize: limit,
      totalItems: transactions_aggregate?.aggregate?.count || 0,
   })

   return (
      <Layout noPadding>
         <header tw="flex items-center gap-3 mb-4 px-3 mt-4">
            <h1 tw="text-2xl">Transactions</h1>
            <Button.Icon is_small onClick={() => setIsFormOpen(true)}>
               <Icon.Add tw="stroke-current" />
            </Button.Icon>
         </header>
         <CurrentMonthExpenditure />
         <header>
            <section tw="mt-[-1px] h-auto border-t border-b border-dark-200 flex flex-col md:(flex-row)">
               <fieldset tw="border-b border-dark-200 h-10 md:(flex-1 h-full border-none)">
                  <input
                     type="text"
                     id="search"
                     name="search"
                     value={keyword}
                     onChange={e => {
                        setKeyword(e.target.value)
                        onSearch(e.target.value)
                        pagination.setPage(0)
                     }}
                     placeholder="Search transactions"
                     tw="w-full h-10 bg-transparent px-3 focus:(outline-none ring-0 ring-offset-0 bg-transparent)"
                  />
               </fieldset>
               <aside tw="flex border-dark-200 h-10 divide-x divide-gray-700 md:(h-full border-l)">
                  <button
                     onClick={() => setIsExportPanelOpen(!isExportPanelOpen)}
                     tw="text-sm flex items-center justify-center md:(justify-start) flex-1 h-full pl-5 hover:(bg-dark-200)"
                  >
                     Export
                     <span tw="h-10 w-10 flex items-center justify-center">
                        {isExportPanelOpen ? (
                           <Icon.Up tw="stroke-current" />
                        ) : (
                           <Icon.Down tw="stroke-current" />
                        )}
                     </span>
                  </button>
                  <button
                     onClick={() => setIsSortPanelOpen(!isSortPanelOpen)}
                     tw="text-sm flex items-center justify-center flex-1 h-full pl-5 hover:(bg-dark-200) md:(justify-start)"
                  >
                     Sort
                     <span tw="h-10 w-10 flex items-center justify-center">
                        {isSortPanelOpen ? (
                           <Icon.Up tw="stroke-current" />
                        ) : (
                           <Icon.Down tw="stroke-current" />
                        )}
                     </span>
                  </button>
               </aside>
            </section>
            {isExportPanelOpen && (
               <Export
                  where={where}
                  setIsExportPanelOpen={setIsExportPanelOpen}
               />
            )}
            {isSortPanelOpen && <SortBy />}
         </header>
         <main>
            <main>
               <Filters pagination={pagination} />
               <FilterBy />
               <BulkActions />
               <main tw="flex-1 hidden md:block">
                  <TableView resetPage={() => pagination.setPage(0)} />
               </main>
               <main tw="md:hidden">
                  <CardView resetPage={() => pagination.setPage(0)} />
               </main>
               <Filters pagination={pagination} />
            </main>
         </main>
         <ReactModal
            isOpen={isFormOpen}
            onRequestClose={() => setIsFormOpen(false)}
         >
            <Form />
         </ReactModal>
      </Layout>
   )
}

export default IndexPage
