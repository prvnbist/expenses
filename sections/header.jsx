import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { TOTAL_EXPENSES, TOTAL_EARNINGS } from '../queries'

import { formatCurrency } from '../utils'

export const Header = () => {
   const {
      loading: expensesLoading,
      error: expensesError,
      data: expensesData,
   } = useQuery(TOTAL_EXPENSES)
   const {
      loading: earningsLoading,
      error: earningsError,
      data: earningsData,
   } = useQuery(TOTAL_EARNINGS)

   if (expensesLoading && earningsLoading) return <div>Loading...</div>
   if (expensesError && earningsError)
      return (
         <div>
            {expensesError && expensesError.message}
            {earningsError && earningsError.message}
         </div>
      )
   return (
      <section className="flex mb-4">
         <main className="mr-3 flex flex-col bg-red-400 p-3 rounded-lg">
            <h3 className="uppercase text-red-800 tracking-wider">
               Total Expenses
            </h3>
            <span className="text-3xl font-bold text-white">
               {formatCurrency(
                  expensesData?.total_expenses.aggregate.sum.amount
               )}
            </span>
         </main>
         <main className="flex flex-col bg-indigo-400 p-3 rounded-lg">
            <h3 className="uppercase text-indigo-800 tracking-wider">
               Total Earning
            </h3>
            <span className="text-3xl font-bold text-white">
               {formatCurrency(
                  earningsData?.total_earnings.aggregate.sum.amount
               )}
            </span>
         </main>
      </section>
   )
}
