import React from 'react'
import tw from 'twin.macro'
import Head from 'next/head'
import Modal from 'react-modal'
import { useRouter } from 'next/router'
import { styled } from '@stitches/react'

import * as Icon from 'icons'
import Layout from 'sections/layout'
import { useDebounce, usePrevious } from 'hooks'
import {
   Filters,
   SortBy,
   CreateTransaction,
   Listing,
   ViewBreakdown,
} from './components'

interface ISortByState {
   title: 'asc' | 'desc'
   raw_date: 'asc' | 'desc'
}

interface ISelectedNode {
   value: string
   label: string
}

interface IFilterState {
   categories: ISelectedNode[]
   accounts: ISelectedNode[]
   payment_methods: ISelectedNode[]
}

export default function Dashboard() {
   const router = useRouter()
   const [search, setSearch] = React.useState('')
   const previousSearch = usePrevious(search)
   const debouncedSearch = useDebounce(search, 500)
   const [filters, setFilters] = React.useState<IFilterState>({
      categories: [],
      accounts: [],
      payment_methods: [],
   })
   const [sortBy, setSortBy] = React.useState<ISortByState>({
      title: 'asc',
      raw_date: 'desc',
   })
   const [isModalOpen, setIsModalOpen] = React.useState(false)
   const [isBreakdownModalOpen, setIsBreakdownModalOpen] = React.useState(false)

   React.useEffect(() => {
      if (router.query.id && router.query.view) {
         setIsBreakdownModalOpen(true)
      } else if (router.query.id) {
         setIsModalOpen(true)
      }
   }, [router.query])

   return (
      <Layout>
         <Head>
            <title>Transactions</title>
         </Head>
         <header tw="px-4 pt-4 flex flex-col space-y-3 justify-between md:(flex-row items-center space-y-0)">
            <aside tw="flex items-center space-x-3">
               <h1
                  data-test="page-title"
                  tw="font-heading text-2xl font-medium text-gray-400"
               >
                  Transactions
               </h1>
               <button
                  title="Create Transaction"
                  data-test="create-transaction"
                  onClick={() => setIsModalOpen(true)}
                  tw="cursor-pointer h-10 w-10 border border-dark-200 flex items-center justify-center hover:bg-dark-300"
               >
                  <Icon.Add tw="stroke-current text-white" />
               </button>
            </aside>
            <Styles.Filters>
               <Styles.Search>
                  <span>
                     <Icon.Search />
                  </span>
                  <input
                     type="text"
                     value={search}
                     title="Search Transactions"
                     placeholder="search by title..."
                     onChange={e => setSearch(e.target.value)}
                  />
               </Styles.Search>
               <Filters filters={{ ...filters }} setFilters={setFilters} />
               <SortBy sortBy={{ ...sortBy }} setSortBy={setSortBy} />
            </Styles.Filters>
         </header>
         <Listing
            sortBy={sortBy}
            filters={filters}
            search={{
               current: search,
               debounced: debouncedSearch,
               previous: previousSearch || '',
            }}
         />
         <Modal
            isOpen={isModalOpen}
            contentLabel="Create Transaction"
            onRequestClose={() => setIsModalOpen(false)}
         >
            <CreateTransaction
               closeModal={() => {
                  setIsModalOpen(false)
                  router.push('/transactions')
               }}
            />
         </Modal>
         <Modal
            contentLabel="Breakdown"
            isOpen={isBreakdownModalOpen}
            style={{ content: { maxWidth: '75%' } }}
            onRequestClose={() => setIsBreakdownModalOpen(false)}
         >
            <ViewBreakdown
               closeModal={() => {
                  setIsBreakdownModalOpen(false)
                  router.push('/transactions')
               }}
            />
         </Modal>
      </Layout>
   )
}

const Styles = {
   Filters: styled('section', {
      ...tw`flex items-center gap-2`,
   }),
   Search: styled('div', {
      ...tw`w-full md:max-w-[320px] flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
      span: {
         ...tw`flex-shrink-0 h-full w-10 flex items-center justify-center`,
         svg: { ...tw`stroke-current text-gray-500` },
      },
      input: { ...tw`bg-transparent focus:outline-none w-full` },
   }),
}
