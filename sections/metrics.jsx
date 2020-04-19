import { useQuery } from '@apollo/react-hooks'

import { Metric } from '../components'
import { EXPENSES_COUNT, EARNINGS_COUNT } from '../queries'

export const Metrics = () => {
   const { data: expensesData, loading: expensesLoading } = useQuery(
      EXPENSES_COUNT
   )
   const { data: earningsData, loading: earningsLoading } = useQuery(
      EARNINGS_COUNT
   )
   return (
      <section className="flex">
         <Metric loading={expensesLoading} type="expenses" label="Expenses">
            {expensesData?.total_expenses.aggregate.count}
         </Metric>
         <Metric loading={earningsLoading} type="earnings" label="Earnings">
            {earningsData?.total_earnings.aggregate.count}
         </Metric>
      </section>
   )
}
