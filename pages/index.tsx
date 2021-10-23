import React from 'react'
import tw, { styled } from 'twin.macro'
import { usePagination } from 'react-use-pagination'

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
         <header>
            <section tw="mt-[-1px] h-auto border-t border-b border-gray-700 flex flex-col md:(h-12 flex-row)">
               <fieldset tw="border-b border-gray-700 h-10 md:(flex-1 h-full border-none)">
                  <input
                     type="text"
                     id="search"
                     name="search"
                     value={keyword}
                     onChange={e => {
                        setKeyword(e.target.value)
                        onSearch(e.target.value)
                     }}
                     placeholder="Search transactions"
                     tw="w-full h-10 bg-transparent px-3 focus:(outline-none ring-0 ring-offset-0 bg-transparent) md:(h-full)"
                  />
               </fieldset>
               <aside tw="flex border-gray-700 h-10 divide-x divide-gray-700 md:(h-full border-l)">
                  {/* <button
                     onClick={() => setIsExportPanelOpen(!isExportPanelOpen)}
                     tw="flex items-center justify-center md:(justify-start) flex-1 h-full pl-5 hover:(bg-gray-700)"
                  >
                     Export
                     <span tw="h-12 w-12 flex items-center justify-center">
                        {isExportPanelOpen ? (
                           <Icon.Up tw="stroke-current" />
                        ) : (
                           <Icon.Down tw="stroke-current" />
                        )}
                     </span>
                  </button> */}
                  <button
                     onClick={() => setIsSortPanelOpen(!isSortPanelOpen)}
                     tw="flex items-center justify-center flex-1 h-full pl-5 hover:(bg-gray-700) md:(justify-start)"
                  >
                     Sort
                     <span tw="h-10 w-10 flex items-center justify-center md:(h-12 w-12)">
                        {isSortPanelOpen ? (
                           <Icon.Up tw="stroke-current" />
                        ) : (
                           <Icon.Down tw="stroke-current" />
                        )}
                     </span>
                  </button>
                  <button
                     tw="flex items-center justify-center md:(justify-start) flex-1 h-full pr-5 hover:(bg-gray-700)"
                     onClick={() => setIsFormOpen(true)}
                  >
                     <span tw="h-10 w-10 flex items-center justify-center md:(h-12 w-12)">
                        <Icon.Add tw="stroke-current" />
                     </span>
                     Add
                  </button>
               </aside>
            </section>
            {/* {isExportPanelOpen && (
               <Export
                  where={where}
                  setIsExportPanelOpen={setIsExportPanelOpen}
               />
            )} */}
            {isSortPanelOpen && <SortBy />}
         </header>
         <Styles.Main isFormOpen={isFormOpen}>
            <main>
               <Filters pagination={pagination} />
               <FilterBy />
               <BulkActions />
               <main tw="flex-1 hidden md:block">
                  <TableView />
               </main>
               <main tw="md:hidden">
                  <CardView />
               </main>
               <Filters pagination={pagination} />
            </main>
            <aside>
               <Form />
            </aside>
         </Styles.Main>
      </Layout>
   )
}

export default IndexPage

const Styles = {
   Main: styled.main`
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: ${props =>
         props.isFormOpen ? '1fr 360px' : '1fr'};
      @media (max-width: 968px) {
         grid-template-columns: 1fr;
         > aside {
            z-index: 100;
            ${tw`pb-3 fixed inset-0 bg-gray-800`}
         }
      }
      > aside {
         ${props => (props.isFormOpen ? tw`flex` : tw`hidden`)}
         ${tw`mt-[-1px] flex-col border-l border-gray-700`}
         > main {
            ${tw`flex-1 overflow-y-auto overflow-x-hidden`}
         }
      }
   `,
}
