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
         const total_pages = Math.ceil(total_expenses.aggregate.count / limit)
         setPages(total_pages)
      }
   }, [total_expenses, limit])

   return (
      <div className="flex">
         <div className="w-9/12 mr-4">
            <div className="flex items-center justify-between mt-4 border-b pb-1">
               <h1 className="text-xl text-teal-600">Expenses</h1>
               <section className="flex items-center">
                  <span>Pages:</span>
                  <select
                     onChange={e => setOffset(e.target.value * limit)}
                     className="border"
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
