import React from 'react'
import tw from 'twin.macro'
import Dinero from 'dinero.js'
import { styled } from '@stitches/react'
import { useQuery } from '@apollo/client'

import * as Icon from '../../../icons'
import { Loader } from '../../../components'
import { useDebounce } from '../../../hooks'
import QUERIES from '../../../graphql/queries'

interface ILayout {
   user: { id: string }
}

interface ITransaction {
   id: string
   type: string
   date: string
   title: string
   amount: number
   raw_date: string
}

const Listing = ({ user }: ILayout): JSX.Element => {
   const [search, setSearch] = React.useState('')
   const [status, setStatus] = React.useState('LOADING')
   const [transactions, setTransactions] = React.useState([])
   const [transactionsAggregate, setTransactionsAggregate] = React.useState({
      count: 0,
      sum: { credit: 0, debit: 0 },
   })

   const debouncedSearch = useDebounce(search, 500)

   useQuery(QUERIES.TRANSACTIONS.LIST, {
      skip: !user?.id,
      fetchPolicy: 'network-only',
      variables: {
         user_id: user?.id,
         order_by: { raw_date: 'desc', title: 'asc' },
         where: {
            user_id: { _eq: user?.id },
            _or: [{ title: { _ilike: `%${debouncedSearch.trim()}%` } }],
         },
      },
      onCompleted: ({ transactions = {}, transactions_aggregate = {} }) => {
         if (transactions_aggregate.aggregate.count === 0) {
            setStatus('EMPTY')
            return
         }
         setTransactions(transactions.nodes)
         setTransactionsAggregate(transactions_aggregate.aggregate)
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
   if (status === 'EMPTY') return <p>Start by creating a transaction.</p>
   return (
      <Styles.Container>
         <Styles.Metrics>
            <Styles.Metric>
               <span>Total Transactions</span>
               <h2>{transactionsAggregate.count}</h2>
            </Styles.Metric>
            <Styles.Metric>
               <span>Total Income</span>
               <h2>
                  {Dinero({
                     amount: transactionsAggregate.sum.credit,
                     currency: 'INR',
                  }).toFormat()}
               </h2>
            </Styles.Metric>
            <Styles.Metric>
               <span>Total Expense</span>
               <h2>
                  {Dinero({
                     amount: transactionsAggregate.sum.debit,
                     currency: 'INR',
                  }).toFormat()}
               </h2>
            </Styles.Metric>
         </Styles.Metrics>
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
         <Styles.Items>
            {transactions.map((transaction: ITransaction) => (
               <Styles.Item
                  key={transaction.id}
                  is_expense={transaction.type === 'expense'}
               >
                  <main>
                     <h3>{transaction.title}</h3>
                     <span>{transaction.date}</span>
                  </main>
                  <aside>
                     <span>
                        {transaction.type === 'expense' ? '- ' : '+ '}
                        {Dinero({
                           amount: transaction.amount,
                           currency: 'INR',
                        }).toFormat()}
                     </span>
                  </aside>
               </Styles.Item>
            ))}
         </Styles.Items>
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
      ...tw`bg-white flex-1 border border-b-4 rounded-lg px-4 py-3`,
      span: {
         ...tw`text-sm uppercase font-medium tracking-wide text-gray-500`,
      },
      h2: { ...tw`text-4xl font-semibold mt-2` },
   }),
   Items: styled('ul', {
      ...tw`mt-2 flex flex-col divide-y border-t border-b`,
   }),
   Item: styled('li', {
      ...tw`flex items-center justify-between px-4 py-3`,
      '&:nth-child(even)': { ...tw`bg-gray-50` },
      main: {
         h3: { ...tw`text-xl font-medium` },
         span: { ...tw`text-gray-500` },
      },
      aside: {
         span: {
            ...tw`text-xl font-semibold`,
         },
      },
      variants: {
         is_expense: {
            true: {
               aside: { span: { ...tw`text-red-500` } },
            },
            false: {
               aside: { span: { ...tw`text-indigo-500` } },
            },
         },
      },
   }),
   Search: styled('div', {
      ...tw`max-w-[320px] flex items-center border border-b-2 border-gray-300 text-gray-900 rounded-md h-12 focus-within:border-indigo-500`,
      span: {
         ...tw`flex-shrink-0 h-full w-10 flex items-center justify-center`,
         svg: { ...tw`stroke-current text-gray-500` },
      },
      input: { ...tw`focus:outline-none w-full` },
   }),
}
