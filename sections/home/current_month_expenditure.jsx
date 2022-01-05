import React from 'react'
import tw from 'twin.macro'
import { useQuery } from '@apollo/client'
import ReactEcharts from 'echarts-for-react'
import { startOfMonth, format, endOfMonth } from 'date-fns'

import { Loader } from '../../components'
import { useConfig } from '../../context'
import { CURRENT_MONTH_EXPENDITURE } from '../../graphql'

export const CurrentMonthExpenditure = () => {
   const { methods } = useConfig()
   const { loading, data, error } = useQuery(CURRENT_MONTH_EXPENDITURE, {
      variables: {
         where1: {
            type: {
               _eq: 'expense',
            },
            raw_date: {
               _gte: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
               _lte: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
            },
         },
         where2: {
            type: {
               _eq: 'income',
            },
            raw_date: {
               _gte: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
               _lte: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
            },
         },
      },
   })

   if (loading) return <Loader />
   if (error) return null
   return (
      <section tw="flex flex-wrap justify-center">
         <div tw="w-full p-6 flex flex-col items-center md:(w-auto border-b-0)">
            <span tw="font-medium uppercase text-gray-500">
               {format(new Date(), 'MMM yyyy')}
            </span>
            <ReactEcharts
               style={{ width: '180px', height: '180px' }}
               option={{
                  tooltip: {
                     trigger: 'item',
                     formatter: props => {
                        return `<span>
                              ${props.marker}
                              ${props.data.name}
                              <h3 style="margin-top:8px; font-size: 24px">${methods.format_currency(
                                 props.data.value
                              )}</h3>
                           </span>`
                     },
                  },
                  series: [
                     {
                        type: 'pie',
                        radius: ['40%', '80%'],
                        label: { show: false },
                        avoidLabelOverlap: false,
                        data: [
                           {
                              name: 'Expense',
                              value: data.expense_aggregate.aggregate.sum.debit,
                              itemStyle: { color: 'rgb(248,113,113)' },
                           },
                           {
                              name: 'Income',
                              value: data.income_aggregate.aggregate.sum.credit,
                              itemStyle: { color: 'rgb(129,140,248)' },
                           },
                        ],
                     },
                  ],
               }}
            />
         </div>
      </section>
   )
}
