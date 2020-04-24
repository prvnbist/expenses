import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { TOTAL_EXPENSES, TOTAL_EARNINGS } from '../queries'

import { formatCurrency } from '../utils'

import { Stat } from '../components'

export const Header = () => {
   const { data: expensesData, loading: expensesLoading } = useQuery(
      TOTAL_EXPENSES
   )
   const { data: earningsData, loading: earningsLoading } = useQuery(
      TOTAL_EARNINGS
   )
   return (
      <section className="grid gap-3 sm:grid-cols-2 lg:flex lg:space-x-3 mb-6">
         <Stat loading={expensesLoading} type="expenses" label="Total Expenses">
            {formatCurrency(expensesData?.total_expenses.aggregate.sum.amount)}
         </Stat>
         <Stat loading={earningsLoading} type="earnings" label="Total Earning">
            {formatCurrency(earningsData?.total_earnings.aggregate.sum.amount)}
         </Stat>
         <Stat type="neutral" label="Balance">
            {formatCurrency(
               earningsData?.total_earnings.aggregate.sum.amount -
                  expensesData?.total_expenses.aggregate.sum.amount
            )}
         </Stat>
      </section>
   )
}
