import { useSubscription } from '@apollo/react-hooks'

import { EARNINGS, TOTAL_EARNINGS } from '../../queries'
import { Listing, Analytics } from './tables'
import { Cards } from './cards'

import { Label } from '../../components'

import { useWindowSize } from '../../utils'

export const Earnings = () => {
   const { width } = useWindowSize()
   const [search, setSearch] = React.useState('%%')
   const [limit, setLimit] = React.useState(10)
   const [offset, setOffset] = React.useState(0)
   const [pages, setPages] = React.useState(0)
   const [sortBy, setSortBy] = React.useState({
      key: 'date',
      value: 'desc_nulls_last',
   })
   const { data: { total_earnings = {} } = {} } = useSubscription(
      TOTAL_EARNINGS
   )
   const { loading, data: { earnings = [] } = {} } = useSubscription(EARNINGS, {
      variables: {
         limit,
         offset,
         order_by: {
            [sortBy.key]: sortBy.value,
         },
         where: {
            source: { _like: search },
         },
      },
   })

   React.useEffect(() => {
      if (total_earnings.aggregate) {
         const total_pages = Math.ceil(total_earnings.aggregate.count / limit)
         setPages(total_pages)
      }
   }, [total_earnings, limit])

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
                     value={search.replace(/%/g, '')}
                     placeholder="Search by source..."
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
                     name="sortBy"
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
                     <option value="asc">source</option>
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
                     value={offset}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 border-b pb-2">
               <div className="flex justify-between sm:justify-start">
                  <h1 className="text-xl text-teal-600">Earnings</h1>
               </div>
               <div className="mt-2 mb-3 sm:my-0 flex items-start flex-wrap sm:items-center sm:flex-row sm:space-x-4"></div>
            </div>
            {width >= 768 && <Listing loading={loading} earnings={earnings} />}
            {width < 768 && <Cards loading={loading} earnings={earnings} />}
         </div>
         <div className="w-full lg:w-3/12">
            <h1 className="mt-4 text-xl text-teal-600 border-b pb-1">
               Analytics
            </h1>
            <Analytics />
         </div>
      </div>
   )
}
