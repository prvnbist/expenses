import { useQuery } from '@apollo/react-hooks'

import { Listing, Analytics } from './tables'
import { Cards } from './cards'
import { EXPENSES, TOTAL_EXPENSES } from '../../queries'

import { Label } from '../../components'

import { useWindowSize } from '../../utils'

export const Expenses = () => {
   const { width } = useWindowSize()
   const [search, setSearch] = React.useState('%%')
   const [limit, setLimit] = React.useState(10)
   const [offset, setOffset] = React.useState(0)
   const [sortBy, setSortBy] = React.useState({
      key: 'date',
      value: 'desc_nulls_last',
   })
   const [pages, setPages] = React.useState(0)
   const { data: { total_expenses = {} } = {} } = useQuery(TOTAL_EXPENSES)
   const { loading, data: { expenses = [] } = {} } = useQuery(EXPENSES, {
      variables: {
         limit,
         offset,
         order_by: {
            [sortBy.key]: sortBy.value,
         },
         where: {
            title: { _like: search },
         },
      },
   })

   React.useEffect(() => {
      if (total_expenses.aggregate) {
         const total_pages = Math.ceil(total_expenses.aggregate.count / limit)
         setPages(total_pages)
      }
   }, [total_expenses, limit])

   return (
      <div className="flex lg:space-x-4 flex-col lg:flex-row">
         <div className="w-full lg:w-2/12">
            <h1 className="mt-4 text-xl text-teal-600 border-b pb-2">
               Filters
            </h1>
            <div className="rounded-lg bg-gray-200 p-3 pt-2 mt-3">
               <section className="mb-3">
                  <Label htmlFor="search">Search</Label>
                  <input
                     type="text"
                     name="search"
                     value={search.replace(/%/g, '')}
                     placeholder="Search by title..."
                     className="px-2 mt-1 bg-white border w-full rounded h-8"
                     onChange={e => setSearch(`%${e.target.value}%`)}
                  />
               </section>
               <section className="flex flex-col mb-3">
                  <label
                     htmlFor="sortby"
                     className="uppercase text-gray-500 text-sm tracking-wider"
                  >
                     Sort By
                  </label>
                  <select
                     name="sortby"
                     className="mt-1 border bg-white rounded h-8 pl-1"
                     onChange={e => {
                        const { label } = e.target.options[
                           e.target.options.selectedIndex
                        ]
                        setOffset(0)
                        setSortBy({
                           key: label,
                           value: e.target.value,
                        })
                     }}
                  >
                     <option value="desc_nulls_last">date</option>
                     <option value="asc">title</option>
                     <option value="desc">amount</option>
                     <option value="asc_nulls_last">category</option>
                  </select>
               </section>
               <section className="flex flex-col mb-3">
                  <Label htmlFor="rowsPerPage">Rows Per Page</Label>
                  <select
                     value={limit}
                     name="rowsPerPage"
                     className="mt-1 border bg-white rounded h-8 pl-1"
                     onChange={e => {
                        setOffset(0)
                        setLimit(Number(e.target.value))
                     }}
                  >
                     <option value={5}>5</option>
                     <option value={10}>10</option>
                     <option value={25}>25</option>
                     <option value={50}>50</option>
                  </select>
               </section>
               <section className="flex flex-col">
                  <Label htmlFor="pages">Pages</Label>
                  <select
                     name="pages"
                     className="mt-1 border bg-white rounded h-8 pl-1"
                     onChange={e => setOffset(e.target.value * limit)}
                  >
                     {Array(pages)
                        .fill()
                        .map((_, index) => (
                           <option key={index} value={index}>
                              {index + 1}
                           </option>
                        ))}
                  </select>
               </section>
            </div>
         </div>
         <div className="w-full lg:w-7/12">
            <h1 className="mt-4 text-xl text-teal-600 border-b pb-2">
               Expenses
            </h1>
            {width >= 768 && <Listing loading={loading} expenses={expenses} />}
            {width < 768 && <Cards loading={loading} expenses={expenses} />}
         </div>
         <div className="w-full lg:w-3/12">
            <h1 className="mt-4 text-xl text-teal-600 border-b pb-2">
               Analytics
            </h1>
            <Analytics />
         </div>
      </div>
   )
}
