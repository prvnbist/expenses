import React from 'react'
import tw from 'twin.macro'
import { styled } from '@stitches/react'
import { useQuery } from '@apollo/client'

import Table from './table'
import { useUser } from 'lib/user'
import QUERIES from 'graphql/queries'
import { useSetting } from 'lib/settings'
import { Empty, Loader } from 'components'

interface IChildRef {
   current?: (input: number) => void | null
}

interface ISortByState {
   title: 'asc' | 'desc'
   raw_date: 'asc' | 'desc'
}

interface IListingProps {
   search: {
      current: string
      debounced: string
      previous: string
   }
   sortBy: ISortByState
}

const Listing = ({ search, sortBy }: IListingProps): JSX.Element => {
   const { user } = useUser()
   const { settings } = useSetting()
   const childRef = React.useRef<IChildRef>(null)
   const [pagination, setPagination] = React.useState({
      page: 0,
      size: 10,
      count: 0,
   })
   const [status, setStatus] = React.useState('LOADING')
   const [transactions, setTransactions] = React.useState([])

   const onPageChange = React.useCallback(page => {
      setPagination(value => ({ ...value, page }))
   }, [])

   React.useEffect(() => {
      if (search.current !== search.previous) {
         onPageChange(0)
         childRef?.current?.(0)
      }
   }, [search.current, search.previous])

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
            _or: [
               { title: { _ilike: `%${search.debounced.trim()}%` } },
               { category: { _ilike: `%${search.debounced.trim()}%` } },
               { account: { _ilike: `%${search.debounced.trim()}%` } },
               { payment_method: { _ilike: `%${search.debounced.trim()}%` } },
               { group: { _ilike: `%${search.debounced.trim()}%` } },
            ],
         },
         where2: {
            user_id: { _eq: user?.id },
            category: {
               _nin: (settings?.excludeCategoriesFromTotalIncome || []).map(
                  (node: { id: string; title: string }) => node.title
               ),
            },
            _or: [
               { title: { _ilike: `%${search.debounced.trim()}%` } },
               { category: { _ilike: `%${search.debounced.trim()}%` } },
               { account: { _ilike: `%${search.debounced.trim()}%` } },
               { payment_method: { _ilike: `%${search.debounced.trim()}%` } },
               { group: { _ilike: `%${search.debounced.trim()}%` } },
            ],
         },
      },
      onCompleted: ({ transactions = {}, transactions_aggregate = {} }) => {
         if (transactions_aggregate.aggregate.count === 0) {
            setStatus('EMPTY')
            setTransactions([])
            setPagination({
               page: 0,
               size: 10,
               count: 0,
            })
            return
         }
         setTransactions(transactions.nodes)
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
   if (status === 'EMPTY' && search.current.length === 0)
      return <Empty message="Create a transaction to begin" />
   return (
      <Styles.Container>
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
   Filters: styled('section', {
      ...tw`mb-3 flex items-center gap-2`,
   }),
   Search: styled('div', {
      ...tw`max-w-[320px] flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
      span: {
         ...tw`flex-shrink-0 h-full w-10 flex items-center justify-center`,
         svg: { ...tw`stroke-current text-gray-500` },
      },
      input: { ...tw`bg-transparent focus:outline-none w-full` },
   }),
}
