import React from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'
import { useSubscription } from '@apollo/client'
import {
   Line,
   YAxis,
   XAxis,
   Tooltip,
   LineChart,
   CartesianGrid,
   ResponsiveContainer,
} from 'recharts'

import { Layout } from '../sections'
import { useConfig } from '../context'
import { Loader, Table, TableLoader, Tabs } from '../components'
import {
   OVERALL,
   EXPENSES_BY_YEARS,
   EXPENSES_BY_MONTHS,
   EXPENSES_BY_CATEGORIES,
   INCOMES_BY_YEARS,
   INCOMES_BY_MONTHS,
   INCOMES_BY_CATEGORIES,
} from '../graphql'

const Styles = {
   Chart: {
      Main: styled.main`
         ${tw`grid gap-3`}
         grid-auto-rows: 300px;
         grid-template-columns: repeat(4, 1fr);
         grid-template-areas:
            'section1 section1 section1 section1'
            'section2 section2 section3 section3'
            'section4 section4 section5 section5'
            'section6 section6 section6 section6';
         > section:nth-of-type(1) {
            grid-area: section1;
         }
         > section:nth-of-type(2) {
            grid-area: section2;
         }
         > section:nth-of-type(3) {
            grid-area: section3;
         }
         > section:nth-of-type(4) {
            grid-area: section4;
         }
         > section:nth-of-type(5) {
            grid-area: section5;
         }
         > section:nth-of-type(6) {
            grid-area: section6;
         }

         @media screen and (max-width: 767px) {
            grid-template-columns: 1fr;
            grid-template-areas: 'section1' 'section2' 'section3' 'section4' 'section5' 'section6';
         }
      `,
   },
   Metrics: tw.ul`flex flex-wrap items-center gap-3 `,
   Metric: styled.li`
      ${tw`pt-2 pb-3 px-3 flex flex-col flex-shrink-0 rounded w-full md:w-64 h-24`}
      > span {
         ${tw`uppercase font-medium tracking-wider`}
      }
      > h3 {
         ${tw`mt-auto text-3xl font-bold`}
      }
   `,
}

const Analytics = (): JSX.Element => {
   return (
      <Layout>
         <header>
            <Metrics />
         </header>
         <Tabs>
            <Tabs.List>
               <Tabs.ListItem>Charts View</Tabs.ListItem>
               <Tabs.ListItem>Table View</Tabs.ListItem>
            </Tabs.List>
            <Tabs.Panels>
               <Tabs.Panel>
                  <ChartsView />
               </Tabs.Panel>
               <Tabs.Panel>
                  <TableView />
               </Tabs.Panel>
            </Tabs.Panels>
         </Tabs>
      </Layout>
   )
}

export default Analytics

const Metrics = (): JSX.Element => {
   const { methods } = useConfig()
   const [overall, setOverall] = React.useState({
      'Total Income': 0,
      'Total Expense': 0,
      Balance: 0,
      'Total Expenses': 0,
      'Total Incomes': 0,
   })
   const { loading } = useSubscription(OVERALL, {
      onSubscriptionData: ({
         subscriptionData: { data: { overall: nodes = [] } = {} } = {},
      }) => {
         const object = {
            'Total Income': 0,
            'Total Expense': 0,
            Balance: 0,
            'Total Expenses': 0,
            'Total Incomes': 0,
         }
         nodes.forEach(node => {
            object[node.title] = node.amount
         })
         setOverall(object)
      },
   })
   if (loading)
      return (
         <Styles.Metrics>
            <Styles.Metric tw="bg-indigo-500" />
            <Styles.Metric tw="bg-red-400" />
            <Styles.Metric tw="bg-gray-300" />
         </Styles.Metrics>
      )
   return (
      <Styles.Metrics>
         <Styles.Metric tw="bg-indigo-500">
            <span tw="text-indigo-800">Total Income</span>
            <h3>
               {methods.format_currency(Number(overall['Total Income']) || 0)}
            </h3>
         </Styles.Metric>
         <Styles.Metric tw="bg-red-400">
            <span tw="text-red-800">Total Expense</span>
            <h3>
               {methods.format_currency(Number(overall['Total Expense']) || 0)}
            </h3>
         </Styles.Metric>
         <Styles.Metric tw="bg-gray-300">
            <span tw="text-gray-600">Balance</span>
            <h3 tw="text-gray-600">
               {methods.format_currency(Number(overall['Balance']) || 0)}
            </h3>
         </Styles.Metric>
      </Styles.Metrics>
   )
}

const CHART_HEIGHT = 242

const ChartsView = (): JSX.Element => {
   return (
      <Styles.Chart.Main>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Expenses By Categories</h2>
            <ExpensesByCategoriesChart />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Expenses By Year</h2>
            <ExpensesByYearChart />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Expenses By Months</h2>
            <ExpensesByMonthChart />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Incomes By Categories</h2>
            <IncomesByCategoriesChart />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Incomes By Years</h2>
            <IncomesByYearsChart />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Incomes By Months</h2>
            <IncomesByMonthsChart />
         </section>
      </Styles.Chart.Main>
   )
}

const ExpensesByCategoriesChart = (): JSX.Element => {
   const { loading, data: { expenses_by_categories = {} } = {} } =
      useSubscription(EXPENSES_BY_CATEGORIES)
   return <Chart loading={loading} data={expenses_by_categories.nodes} />
}

const ExpensesByYearChart = (): JSX.Element => {
   const { loading, data: { expenses_by_years = {} } = {} } =
      useSubscription(EXPENSES_BY_YEARS)
   return <Chart loading={loading} data={expenses_by_years.nodes} />
}

const ExpensesByMonthChart = (): JSX.Element => {
   const { loading, data: { expenses_by_months = {} } = {} } =
      useSubscription(EXPENSES_BY_MONTHS)
   return <Chart loading={loading} data={expenses_by_months.nodes} />
}

const IncomesByCategoriesChart = (): JSX.Element => {
   const { loading, data: { incomes_by_categories = {} } = {} } =
      useSubscription(INCOMES_BY_CATEGORIES)
   return <Chart loading={loading} data={incomes_by_categories.nodes} />
}

const IncomesByYearsChart = (): JSX.Element => {
   const { loading, data: { incomes_by_years = {} } = {} } =
      useSubscription(INCOMES_BY_YEARS)
   return <Chart loading={loading} data={incomes_by_years.nodes} />
}

const IncomesByMonthsChart = (): JSX.Element => {
   const { loading, data: { incomes_by_months = {} } = {} } =
      useSubscription(INCOMES_BY_MONTHS)
   return <Chart loading={loading} data={incomes_by_months.nodes} />
}

interface IChartData {
   title: string
   count: number
   amount: number
}

interface IChart {
   loading: boolean
   data: IChartData[]
}

const Chart = ({ loading, data }: IChart): JSX.Element => {
   const { methods } = useConfig()
   if (loading) return <Loader />
   return (
      <main>
         <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <LineChart data={data}>
               <Tooltip
                  cursor={{ fill: '#111827' }}
                  content={({ active, payload }) => (
                     <CustomTooltip
                        active={active}
                        methods={methods}
                        payload={payload}
                     />
                  )}
               />
               <XAxis dataKey="title" fontSize={14} />
               <YAxis
                  width={46}
                  type="number"
                  fontSize={14}
                  dataKey="amount"
                  tickFormatter={tick => {
                     return methods.format_k(tick)
                  }}
               />
               <Line dataKey="amount" stroke="#dff75f" strokeWidth={1} />
               <CartesianGrid stroke="rgba(255,255,255,0.10)" />
            </LineChart>
         </ResponsiveContainer>
      </main>
   )
}

interface ICustomTooltip {
   payload?: any
   active?: boolean
   methods: {
      format_currency: (x: number) => string
   }
}

const CustomTooltip = ({
   active,
   payload,
   methods,
}: ICustomTooltip): JSX.Element => {
   if (!active || payload.length === 0) return <section />

   const { title, amount, count } = payload[0].payload
   return (
      <section tw="bg-gray-700 rounded p-2 gap-2 flex flex-col">
         <span>Title: {title}</span>
         <span>Amount: {methods.format_currency(amount || 0)}</span>
         <span>Total: {count}</span>
      </section>
   )
}

const TableView = () => {
   return (
      <main tw="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Expenses By Categories</h2>
            <ExpensesByCategoriesTable />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Expenses By Year</h2>
            <ExpensesByYearTable />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Expenses By Months</h2>
            <ExpensesByMonthTable />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Incomes By Categories</h2>
            <IncomesByCategoriesTable />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Incomes By Years</h2>
            <IncomesByYearsTable />
         </section>
         <section tw="overflow-x-auto bg-gray-900 px-3 rounded">
            <h2 tw="text-xl h-12 flex items-center">Incomes By Months</h2>
            <IncomesByMonthsTable />
         </section>
      </main>
   )
}

const ExpensesByCategoriesTable = (): JSX.Element => {
   const { loading, data: { expenses_by_categories = {} } = {} } =
      useSubscription(EXPENSES_BY_CATEGORIES)
   const columns = React.useMemo(
      () => [
         { title: 'Categories' },
         { title: 'Amount', is_right: true },
         { title: 'Count', is_right: true },
      ],
      []
   )
   return (
      <TableWrapper
         type="expense"
         columns={columns}
         loading={loading}
         data={expenses_by_categories.nodes}
      />
   )
}

const ExpensesByYearTable = (): JSX.Element => {
   const { loading, data: { expenses_by_years = {} } = {} } =
      useSubscription(EXPENSES_BY_YEARS)
   const columns = React.useMemo(
      () => [
         { title: 'Year' },
         { title: 'Amount', is_right: true },
         { title: 'Count', is_right: true },
      ],
      []
   )
   return (
      <TableWrapper
         type="expense"
         columns={columns}
         loading={loading}
         data={expenses_by_years.nodes}
      />
   )
}

const ExpensesByMonthTable = (): JSX.Element => {
   const { loading, data: { expenses_by_months = {} } = {} } =
      useSubscription(EXPENSES_BY_MONTHS)
   const columns = React.useMemo(
      () => [
         { title: 'Month' },
         { title: 'Amount', is_right: true },
         { title: 'Count', is_right: true },
      ],
      []
   )
   return (
      <TableWrapper
         type="expense"
         columns={columns}
         loading={loading}
         data={expenses_by_months.nodes}
      />
   )
}

const IncomesByCategoriesTable = (): JSX.Element => {
   const { loading, data: { incomes_by_categories = {} } = {} } =
      useSubscription(INCOMES_BY_CATEGORIES)
   const columns = React.useMemo(
      () => [
         { title: 'Categories' },
         { title: 'Amount', is_right: true },
         { title: 'Count', is_right: true },
      ],
      []
   )
   return (
      <TableWrapper
         type="income"
         columns={columns}
         loading={loading}
         data={incomes_by_categories.nodes}
      />
   )
}

const IncomesByYearsTable = (): JSX.Element => {
   const { loading, data: { incomes_by_years = {} } = {} } =
      useSubscription(INCOMES_BY_YEARS)
   const columns = React.useMemo(
      () => [
         { title: 'Year' },
         { title: 'Amount', is_right: true },
         { title: 'Count', is_right: true },
      ],
      []
   )
   return (
      <TableWrapper
         type="income"
         columns={columns}
         loading={loading}
         data={incomes_by_years.nodes}
      />
   )
}

const IncomesByMonthsTable = (): JSX.Element => {
   const { loading, data: { incomes_by_months = {} } = {} } =
      useSubscription(INCOMES_BY_MONTHS)
   const columns = React.useMemo(
      () => [
         { title: 'Month' },
         { title: 'Amount', is_right: true },
         { title: 'Count', is_right: true },
      ],
      []
   )
   return (
      <TableWrapper
         type="income"
         columns={columns}
         loading={loading}
         data={incomes_by_months.nodes}
      />
   )
}

interface IColumns {
   title: string
   is_right?: boolean
}

interface ITableWrapper {
   loading: boolean
   data: IChartData[]
   columns: IColumns[]
   type: 'income' | 'expense'
}

const TableWrapper = (props: ITableWrapper): JSX.Element => {
   const { type, loading, data = [], columns = [] } = props
   const { methods } = useConfig()
   if (loading) return <TableLoader cols={3} />
   return (
      <Table>
         <Table.Head>
            <Table.Row noBg>
               {columns.map(column => (
                  <Table.HCell is_right={column?.is_right}>
                     {column.title}
                  </Table.HCell>
               ))}
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {data.map((node, index) => (
               <Table.Row key={node.title} odd={index % 2 === 0}>
                  <Table.Cell>{node.title}</Table.Cell>
                  <Table.Cell is_right>
                     <span
                        css={[
                           tw`font-medium`,
                           type === 'expense'
                              ? tw`text-red-400`
                              : tw`text-indigo-400`,
                        ]}
                     >
                        {type === 'expense' ? '- ' : '+ '}
                        {methods.format_currency(Number(node.amount) || 0)}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{node.count}</Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}
