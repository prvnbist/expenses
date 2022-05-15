import React from 'react'
import tw from 'twin.macro'
import Dinero from 'dinero.js'
import { styled } from '@stitches/react'
import { useQuery } from '@apollo/client'

import Table from './table'
import SortBy from './sort_by'
import * as Icon from 'icons'
import { useUser } from 'lib/user'
import QUERIES from 'graphql/queries'
import { useSetting } from 'lib/settings'
import { Empty, Loader } from 'components'
import { useDebounce, usePrevious } from 'hooks'

interface ISortByState {
   title: 'asc' | 'desc'
   raw_date: 'asc' | 'desc'
}

interface IChildRef {
   current?: (input: number) => void | null
}

const Listing = (): JSX.Element => {
   const { user } = useUser()
   const { settings } = useSetting()
   const childRef = React.useRef<IChildRef>(null)
   const [search, setSearch] = React.useState('')
   const [pagination, setPagination] = React.useState({
      page: 0,
      size: 10,
      count: 0,
   })
   const [sortBy, setSortBy] = React.useState<ISortByState>({
      title: 'asc',
      raw_date: 'desc',
   })
   const [status, setStatus] = React.useState('LOADING')
   const [transactions, setTransactions] = React.useState([])
   const [allTransactionsAggregate, setAllTransactionsAggregate] =
      React.useState({
         count: 0,
         sum: { credit: 0, debit: 0 },
      })

   const onPageChange = React.useCallback(page => {
      setPagination(value => ({ ...value, page }))
   }, [])

   const debouncedSearch = useDebounce(search, 500)
   const previousSearch = usePrevious(search)

   React.useEffect(() => {
      if (search !== previousSearch) {
         onPageChange(0)
         childRef?.current?.(0)
      }
   }, [previousSearch, search])

   useQuery(QUERIES.TRANSACTIONS.LIST, {
      skip:
         !user?.id ||
         !Array.isArray(settings?.excludeCategoriesFromTotalIncome),
      fetchPolicy: 'network-only',
      variables: {
         order_by: { ...sortBy },
         offset: pagination.page * pagination.size,
         where: {
            user_id: { _eq: user?.id },
            _or: [{ title: { _ilike: `%${debouncedSearch.trim()}%` } }],
         },
         where2: {
            user_id: { _eq: user?.id },
            category: {
               _nin: (settings?.excludeCategoriesFromTotalIncome || []).map(
                  node => node.title
               ),
            },
            _or: [{ title: { _ilike: `%${debouncedSearch.trim()}%` } }],
         },
      },
      onCompleted: ({ transactions = {}, transactions_aggregate = {} }) => {
         if (transactions_aggregate.aggregate.count === 0) {
            setStatus('EMPTY')
            setTransactions([])
            setAllTransactionsAggregate({
               count: 0,
               sum: { credit: 0, debit: 0 },
            })
            setPagination({
               page: 0,
               size: 10,
               count: 0,
            })
            return
         }
         setTransactions(transactions.nodes)
         setAllTransactionsAggregate(transactions_aggregate.aggregate)
         const total_transactions = transactions_aggregate.aggregate.count
         const page_size = pagination.size
         const total_pages = Math.ceil(
            total_transactions % page_size === 0
               ? total_transactions / page_size
               : total_transactions / page_size + 1
         )
         setPagination(value => ({
            ...value,
            count:
               transactions_aggregate.aggregate.count <= 10 ? 1 : total_pages,
         }))
         setStatus('SUCCESS')
      },
      onError: error => {
         console.error(error)
         setStatus('ERROR')
      },
   })

   if (status === 'LOADING') return <Loader />
   if (status === 'ERROR')
      return <p>Something went wrong, please refresh the page.</p>
   if (status === 'EMPTY' && search.length === 0)
      return <Empty message="Create a transaction to begin" />
   return (
      <Styles.Container>
         <Styles.Metrics>
            <Styles.Metric>
               <span>Total Transactions</span>
               <h2>{allTransactionsAggregate.count}</h2>
            </Styles.Metric>
            <Styles.Metric>
               <span>Total Income</span>
               <h2>
                  {Dinero({
                     amount: allTransactionsAggregate.sum.credit,
                     currency: 'INR',
                  }).toFormat()}
               </h2>
            </Styles.Metric>
            <Styles.Metric>
               <span>Total Expense</span>
               <h2>
                  {Dinero({
                     amount: allTransactionsAggregate.sum.debit,
                     currency: 'INR',
                  }).toFormat()}
               </h2>
            </Styles.Metric>
         </Styles.Metrics>
         <Styles.Filters>
            <Styles.Search>
               <span>
                  <Icon.Search />
               </span>
               <input
                  type="text"
                  value={search}
                  placeholder="search by title..."
                  onChange={e => setSearch(e.target.value)}
               />
            </Styles.Search>
            <SortBy sortBy={{ ...sortBy }} setSortBy={setSortBy} />
         </Styles.Filters>
         <Table
            childRef={childRef}
            pagination={pagination}
            transactions={transactions}
            onPageChange={onPageChange}
         />
      </Styles.Container>
   )
}

export default Listing

const Styles = {
   Container: styled('section', { ...tw`p-4` }),
   Metrics: styled('ul', {
      ...tw`mb-4 flex flex-wrap gap-3`,
   }),
   Metric: styled('li', {
      ...tw`bg-white flex-1 px-4 py-3 bg-dark-300 border border-dark-200`,
      span: {
         ...tw`text-sm uppercase font-medium tracking-wide text-gray-500`,
      },
      h2: {
         ...tw`font-mono text-4xl font-semibold mt-2 text-gray-300`,
      },
   }),
   Filters: styled('section', { ...tw`mb-3 flex items-center gap-2` }),
   Search: styled('div', {
      ...tw`max-w-[320px] flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
      span: {
         ...tw`flex-shrink-0 h-full w-10 flex items-center justify-center`,
         svg: { ...tw`stroke-current text-gray-500` },
      },
      input: { ...tw`bg-transparent focus:outline-none w-full` },
   }),
}
