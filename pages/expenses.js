import tw from 'twin.macro'
import { useSubscription } from '@apollo/react-hooks'

import { Layout } from '../sections'
import { Cards } from '../sections/expenses/cards'
import { EXPENSES, TOTAL_EXPENSES } from '../graphql'
import { useWindowSize, paginate, useDebounce } from '../utils'
import { Listing, Analytics } from '../sections/expenses/tables'

const Expenses = () => {
   const { width } = useWindowSize()
   const [limit] = React.useState(10)
   const [search, setSearch] = React.useState('')
   const [keyword, setKeyword] = React.useState('')
   const [offset, setOffset] = React.useState(0)
   const [sort, setSort] = React.useState({ date: 'desc' })
   const {
      loading: loadingAggregate,
      data: { total_expenses = {} } = {},
   } = useSubscription(TOTAL_EXPENSES, {
      variables: {
         where: {
            ...(search && { title: { _ilike: `%${search}%` } }),
         },
      },
   })
   const { loading, data: { expenses = [] } = {} } = useSubscription(EXPENSES, {
      variables: {
         limit,
         offset: offset * limit,
         order_by: sort,
         where: {
            ...(search && { title: { _ilike: `%${search}%` } }),
         },
      },
   })

   const debouncedSearchTerm = useDebounce(keyword, 500)

   React.useEffect(() => {
      setSearch(debouncedSearchTerm)
   }, [debouncedSearchTerm])

   const TOTAL_PAGES = Math.ceil(total_expenses?.aggregate?.count / limit) || 0

   return (
      <Layout>
         <div tw="w-full lg:w-9/12">
            <h1 tw="mt-4 text-xl text-teal-600 border-b pb-2">Expenses</h1>
            <header tw="my-3 flex items-center justify-center md:justify-between flex-wrap space-y-4 md:space-y-0">
               <input
                  type="text"
                  value={keyword}
                  placeholder="Search by title..."
                  tw="border px-2 h-8 rounded"
                  onChange={e => setKeyword(e.target.value)}
               />
               <section tw="flex items-center justify-center space-x-3">
                  <button
                     tw="h-8 px-2 border rounded"
                     onClick={() => setOffset(offset > 0 ? offset - 1 : 0)}
                  >
                     Prev
                  </button>
                  <ul tw="flex space-x-2">
                     {paginate(offset, TOTAL_PAGES).map((node, index) => (
                        <li key={index}>
                           {typeof node === 'string' ? (
                              <span tw="h-8 w-8">{node}</span>
                           ) : (
                              <button
                                 onClick={() => setOffset(node - 1)}
                                 css={[
                                    tw`h-8 w-8 border rounded`,
                                    offset + 1 === node
                                       ? tw`bg-green-500 border-green-500 text-white`
                                       : '',
                                 ]}
                              >
                                 {node}
                              </button>
                           )}
                        </li>
                     ))}
                  </ul>
                  <button
                     tw="h-8 px-2 border rounded"
                     onClick={() =>
                        setOffset(
                           offset + 1 < TOTAL_PAGES
                              ? offset + 1
                              : TOTAL_PAGES - 1
                        )
                     }
                  >
                     Next
                  </button>
               </section>
            </header>
            {width >= 768 && (
               <Listing
                  sort={sort}
                  setSort={setSort}
                  loading={loading}
                  expenses={expenses}
               />
            )}
            {width < 768 && <Cards loading={loading} expenses={expenses} />}
         </div>
         <div tw="w-full lg:w-3/12">
            <h1 tw="mt-4 text-xl text-teal-600 border-b pb-2">Analytics</h1>
            <Analytics
               loading={loadingAggregate}
               total_expenses={total_expenses}
            />
         </div>
      </Layout>
   )
}

export default Expenses
