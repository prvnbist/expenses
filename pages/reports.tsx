import React from 'react'
import tw from 'twin.macro'
import { useQuery, useSubscription } from '@apollo/client'

import { Layout } from '../sections'
import * as Svg from '../assets/svgs'
import { useConfig } from '../context'
import { Loader, Select, Table, Tabs } from '../components'
import {
   EXPENSE_YEARS,
   MONTHLY_EXPENSE_REPORT,
   INCOME_YEARS,
   MONTHLY_INCOME_REPORT,
} from '../graphql'

const Reports = (): JSX.Element => {
   const { methods } = useConfig()

   return (
      <Layout>
         <header tw="flex items-center justify-between">
            <h1 tw="text-3xl mt-4 mb-3">Reports</h1>
         </header>
         <main>
            <Tabs>
               <Tabs.List>
                  <Tabs.ListItem>Monthly Expenses</Tabs.ListItem>
                  <Tabs.ListItem>Monthly Income</Tabs.ListItem>
               </Tabs.List>
               <Tabs.Panels>
                  <Tabs.Panel>
                     <MonthlyExpensesReport methods={methods} />
                  </Tabs.Panel>
                  <Tabs.Panel>
                     <MonthlyIncomeReport methods={methods} />
                  </Tabs.Panel>
               </Tabs.Panels>
            </Tabs>
         </main>
      </Layout>
   )
}

export default Reports

interface IProps {
   methods: {
      format_currency: (x: number) => string
   }
}

const MonthlyExpensesReport = ({ methods }: IProps): JSX.Element => {
   const [year, setYear] = React.useState(() => new Date().getFullYear())
   const { data: { expense_years_list = [] } = {} } = useQuery(EXPENSE_YEARS)
   const { loading, data: { monthly_expense_report = [] } = {} } =
      useSubscription(MONTHLY_EXPENSE_REPORT, {
         skip: !year,
         variables: {
            order_by: { month: 'asc' },
            where: { year: { _eq: year } },
         },
      })

   const selected_year = () => {
      const index = expense_years_list.findIndex(node => node.year === year)
      if (index === -1) return {}
      return {
         id: index + 1,
         title: expense_years_list[index].year,
      }
   }
   return (
      <>
         <Select
            placeholder="Search year"
            selected={selected_year()}
            on_select={option => setYear(option.title)}
         >
            {expense_years_list.map((option, index) => (
               <Select.Option
                  key={option.year}
                  option={{ id: index + 1, title: option.year }}
               />
            ))}
         </Select>
         <section tw="mt-4">
            {loading ? (
               <Loader />
            ) : (
               <>
                  {monthly_expense_report.length === 0 ? (
                     <div tw="my-6 w-full flex items-center justify-center">
                        <Svg.Empty message="No reports yet!" />
                     </div>
                  ) : (
                     <Table>
                        <Table.Head>
                           <Table.Row>
                              <Table.HCell>Month</Table.HCell>
                              <Table.HCell is_right>Count</Table.HCell>
                              <Table.HCell is_right>Amount</Table.HCell>
                           </Table.Row>
                        </Table.Head>
                        {monthly_expense_report.map((node, index) => (
                           <Table.Row key={index} odd={index % 2 === 0}>
                              <Table.Cell>{node.title}</Table.Cell>
                              <Table.Cell is_right>{node.count}</Table.Cell>
                              <Table.Cell is_right>
                                 <span tw="font-medium text-red-400">
                                    - {methods.format_currency(node.amount)}
                                 </span>
                              </Table.Cell>
                           </Table.Row>
                        ))}
                     </Table>
                  )}
               </>
            )}
         </section>
      </>
   )
}

const MonthlyIncomeReport = ({ methods }: IProps): JSX.Element => {
   const [year, setYear] = React.useState(() => new Date().getFullYear())
   const { data: { income_years_list = [] } = {} } = useQuery(INCOME_YEARS)
   const { loading, data: { monthly_income_report = [] } = {} } =
      useSubscription(MONTHLY_INCOME_REPORT, {
         skip: !year,
         variables: {
            order_by: { month: 'asc' },
            where: { year: { _eq: year } },
         },
      })

   const selected_year = () => {
      const index = income_years_list.findIndex(node => node.year === year)
      if (index === -1) return {}
      return {
         id: index + 1,
         title: income_years_list[index].year,
      }
   }
   return (
      <>
         <Select
            placeholder="Search year"
            selected={selected_year()}
            on_select={option => setYear(option.title)}
         >
            {income_years_list.map((option, index) => (
               <Select.Option
                  key={option.year}
                  option={{ id: index + 1, title: option.year }}
               />
            ))}
         </Select>
         <section tw="mt-4">
            {loading ? (
               <Loader />
            ) : (
               <>
                  {monthly_income_report.length === 0 ? (
                     <div tw="my-6 w-full flex items-center justify-center">
                        <Svg.Empty message="No reports yet!" />
                     </div>
                  ) : (
                     <Table>
                        <Table.Head>
                           <Table.Row>
                              <Table.HCell>Month</Table.HCell>
                              <Table.HCell is_right>Count</Table.HCell>
                              <Table.HCell is_right>Amount</Table.HCell>
                           </Table.Row>
                        </Table.Head>
                        {monthly_income_report.map((node, index) => (
                           <Table.Row key={index} odd={index % 2 === 0}>
                              <Table.Cell>{node.title}</Table.Cell>
                              <Table.Cell is_right>{node.count}</Table.Cell>
                              <Table.Cell is_right>
                                 <span tw="font-medium text-indigo-400">
                                    + {methods.format_currency(node.amount)}
                                 </span>
                              </Table.Cell>
                           </Table.Row>
                        ))}
                     </Table>
                  )}
               </>
            )}
         </section>
      </>
   )
}
