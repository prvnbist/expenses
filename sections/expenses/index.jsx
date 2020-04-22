import { useQuery } from '@apollo/react-hooks'

import { Listing, Analytics } from './tables'
import { EXPENSES, TOTAL_EXPENSES } from '../../queries'

export const Expenses = () => {
   const [limit, setLimit] = React.useState(10)
   const [offset, setOffset] = React.useState(0)
   const [pages, setPages] = React.useState(0)
   const { data: { total_expenses = {} } = {} } = useQuery(TOTAL_EXPENSES)
   const { loading, data: { expenses = [] } = {} } = useQuery(EXPENSES, {
      variables: {
         limit,
         offset,
      },
   })

   React.useEffect(() => {
      if (total_expenses.aggregate) {
         const total_pages = Math.floor(total_expenses.aggregate.count / limit)
         setPages(total_pages)
      }
   }, [total_expenses, limit])

   return (
      <div className="flex space-x-4">
         <div className="w-9/12">
            <div className="flex items-center justify-between mt-4 border-b pb-1">
               <h1 className="text-xl text-teal-600">Expenses</h1>
               <div className="flex items-center space-x-4">
                  <section className="flex items-center">
                     <span>Rows Per Page:</span>
                     <select
                        value={limit}
                        className="border"
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
                  <section className="flex items-center">
                     <span>Pages:</span>
                     <select
                        value={offset}
                        className="border"
                        onChange={e => setOffset(e.target.value * limit)}
                     >
                        {Array(pages)
                           .fill()
                           .map((_, index) => (
                              <option key={index} value={index + 1}>
                                 {index + 1}
                              </option>
                           ))}
                     </select>
                  </section>
               </div>
            </div>

            <Listing loading={loading} expenses={expenses} />
         </div>
         <div className="w-3/12">
            <h1 className="mt-4 text-xl text-teal-600 border-b pb-1">
               Analytics
            </h1>
            <Analytics />
         </div>
      </div>
   )
}
