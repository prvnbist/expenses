import { useQuery } from '@apollo/react-hooks'

import { EARNINGS } from '../../queries'
import { Listing, Analytics } from './tables'

export const Earnings = () => {
   const { loading, data: { earnings = [] } = {} } = useQuery(EARNINGS)
   return (
      <div className="flex">
         <div className="w-9/12 mr-4">
            <h1 className="mt-4 text-xl text-teal-600 border-b pb-1">
               Earnings
            </h1>
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
