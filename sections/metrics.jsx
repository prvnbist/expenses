import { useQuery } from '@apollo/react-hooks'

import { Metric } from '../components'
import { TOTAL_EXPENSES, TOTAL_EARNINGS } from '../queries'
import { formatCurrency } from '../utils'

export const Metrics = () => {
   const { data: expensesData, loading: expensesLoading } = useQuery(
      TOTAL_EXPENSES
   )
   const { data: earningsData, loading: earningsLoading } = useQuery(
      TOTAL_EARNINGS
   )
   return (
      <section className="flex flex-wrap">
         <Metric loading={expensesLoading} type="expenses" label="Expenses">
            {expensesData?.total_expenses.aggregate.count}
         </Metric>
         <Metric
            loading={expensesLoading}
            type="expenses"
            label="Average Spending"
         >
            {formatCurrency(
               expensesData?.total_expenses.aggregate.avg.amount.toFixed(2)
            )}
         </Metric>
         <Metric loading={expensesLoading} type="expenses" label="Min Spent">
            {formatCurrency(
               expensesData?.total_expenses.aggregate.min.amount.toFixed(2)
            )}
         </Metric>
         <Metric loading={expensesLoading} type="expenses" label="Max Spent">
            {formatCurrency(
               expensesData?.total_expenses.aggregate.max.amount.toFixed(2)
            )}
         </Metric>
         <Metric loading={earningsLoading} type="earnings" label="Earnings">
            {earningsData?.total_earnings.aggregate.count}
         </Metric>
         <Metric
            loading={earningsLoading}
            type="earnings"
            label="Average Earned"
         >
            {formatCurrency(
               earningsData?.total_earnings.aggregate.avg.amount.toFixed(2)
            )}
         </Metric>
         <Metric loading={earningsLoading} type="earnings" label="Min Earning">
            {formatCurrency(
               earningsData?.total_earnings.aggregate.min.amount.toFixed(2)
            )}
         </Metric>
         <Metric loading={earningsLoading} type="earnings" label="Max Earning">
            {formatCurrency(
               earningsData?.total_earnings.aggregate.max.amount.toFixed(2)
            )}
         </Metric>
      </section>
   )
}
