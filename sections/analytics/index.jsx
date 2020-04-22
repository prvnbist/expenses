import { useQuery } from '@apollo/react-hooks'

import { EXPENSES } from '../../queries'

import { ByCategories, ByYears, ByMonths } from './tables'

export const Analytics = () => {
   const { loading, error, data: { expenses = [] } = {} } = useQuery(EXPENSES)

   if (loading) return <div>Loading...</div>
   return (
      <div>
         <div className="flex">
            <div className="w-6/12 mr-6">
               <h2 className="border-b pb-2 text-lg mt-3 text-teal-700">
                  Spendings by categories
               </h2>
               <ByCategories expenses={expenses} />
            </div>
            <div className="w-6/12">
               <div className="w-full">
                  <h2 className="border-b pb-2 text-lg mt-3 text-teal-700">
                     Spendings by Years
                  </h2>
                  <ByYears expenses={expenses} />
               </div>
               <div className="w-full">
                  <h2 className="border-b pb-2 text-lg mt-5 text-teal-700">
                     Spendings by Months
                  </h2>
                  <ByMonths expenses={expenses} />
               </div>
            </div>
         </div>
      </div>
   )
}
