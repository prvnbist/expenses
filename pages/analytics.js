import { useSubscription } from '@apollo/react-hooks'

import { Layout } from '../sections'
import { EXPENSES } from '../graphql'
import { ByCategories, ByYears, ByMonths } from '../sections/analytics'

const Analytics = () => {
   const { loading, data: { expenses = [] } = {} } = useSubscription(EXPENSES)

   return (
      <Layout>
         <div className="w-full lg:w-6/12">
            <h2 className="border-b pb-2 text-lg mt-3 text-teal-700">
               Spendings by categories
            </h2>
            {loading ? (
               <div>Loading...</div>
            ) : (
               <ByCategories expenses={expenses} />
            )}
         </div>
         <div className="w-full lg:w-6/12">
            <div className="w-full">
               <h2 className="border-b pb-2 text-lg mt-3 text-teal-700">
                  Spendings by Years
               </h2>
               {loading ? (
                  <div>Loading...</div>
               ) : (
                  <ByYears expenses={expenses} />
               )}
            </div>
            <div className="w-full">
               <h2 className="border-b pb-2 text-lg mt-5 text-teal-700">
                  Spendings by Months
               </h2>
               {loading ? (
                  <div>Loading...</div>
               ) : (
                  <ByMonths expenses={expenses} />
               )}
            </div>
         </div>
      </Layout>
   )
}

export default Analytics
