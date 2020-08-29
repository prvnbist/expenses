import React from 'react'
import tw from 'twin.macro'
import { useSubscription } from '@apollo/react-hooks'

import { useConfig } from '../context'
import { Stat, Tab } from '../components'
import { TOTAL_EXPENSES, TOTAL_EARNINGS } from '../graphql'

export const Header = () => {
   const { methods } = useConfig()
   const { data: expensesData, loading: expensesLoading } = useSubscription(
      TOTAL_EXPENSES
   )
   const { data: earningsData, loading: earningsLoading } = useSubscription(
      TOTAL_EARNINGS
   )
   return (
      <header>
         <section tw="grid gap-3 sm:grid-cols-2 lg:flex lg:space-x-3 mb-6">
            <Stat type="expenses" label="Total Expenses">
               {!expensesLoading
                  ? methods.format_currency(
                       expensesData?.total_expenses.aggregate.sum.amount
                    )
                  : methods.format_currency(0)}
            </Stat>
            <Stat type="earnings" label="Total Earning">
               {!earningsLoading
                  ? methods.format_currency(
                       earningsData?.total_earnings.aggregate.sum.amount
                    )
                  : methods.format_currency(0)}
            </Stat>
            <Stat type="neutral" label="Balance">
               {!expensesLoading && !earningsLoading
                  ? methods.format_currency(
                       earningsData?.total_earnings.aggregate.sum.amount -
                          expensesData?.total_expenses.aggregate.sum.amount
                    )
                  : methods.format_currency(0)}
            </Stat>
         </section>
         <div tw="rounded-lg border">
            <Tab href="/expenses">Expenses</Tab>
            <Tab href="/earnings">Earning</Tab>
            <Tab href="/analytics">Analytics</Tab>
         </div>
      </header>
   )
}
