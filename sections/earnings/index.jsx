import { useQuery } from '@apollo/react-hooks'

import { EARNINGS, TOTAL_EARNINGS } from '../../queries'
import { Listing, Analytics } from './tables'

export const Earnings = () => {
   const [limit, setLimit] = React.useState(10)
   const [offset, setOffset] = React.useState(0)
   const [pages, setPages] = React.useState(0)
   const { data: { total_earnings = {} } = {} } = useQuery(TOTAL_EARNINGS)
   const { loading, data: { earnings = [] } = {} } = useQuery(EARNINGS, {
      variables: {
         limit,
         offset,
      },
   })

   React.useEffect(() => {
      if (total_earnings.aggregate) {
         const total_pages = Math.ceil(total_earnings.aggregate.count / limit)
         setPages(total_pages)
      }
   }, [total_earnings, limit])

   return (
      <div className="flex space-x-4">
         <div className="w-9/12">
            <div className="flex items-center justify-between mt-4 border-b pb-1">
               <h1 className="text-xl text-teal-600">Earnings</h1>
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
                              <option key={index} value={index}>
                                 {index + 1}
                              </option>
                           ))}
                     </select>
                  </section>
               </div>
            </div>

            <Listing loading={loading} earnings={earnings} />
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
