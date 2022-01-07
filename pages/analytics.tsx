import React from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'
import ReactEcharts from 'echarts-for-react'
import { useSubscription } from '@apollo/client'

import { Layout } from '../sections'
import * as Svg from '../assets/svgs'
import { useConfig } from '../context'
import { Loader, Table, Tabs } from '../components'
import {
   OVERALL,
   EXPENSES_BY_YEARS,
   EXPENSES_BY_CATEGORIES,
   INCOMES_BY_YEARS,
   INCOMES_BY_CATEGORIES,
} from '../graphql'

const Styles = {
   Metrics: tw.ul`flex flex-wrap items-center gap-3`,
   Metric: styled.li`
      ${tw`bg-dark-300 border border-dark-200 pt-2 pb-3 px-4 flex flex-col flex-shrink-0 rounded w-full md:w-64 h-24`}
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
         <header tw="flex justify-center">
            <Metrics />
         </header>
         <Tabs>
            <Tabs.List>
               <Tabs.ListItem>Charts View</Tabs.ListItem>
               <Tabs.ListItem>Table View</Tabs.ListItem>
            </Tabs.List>
            <Tabs.Panels>
               <Tabs.Panel>
                  <ReportGrid />
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
            <Styles.Metric />
            <Styles.Metric />
            <Styles.Metric />
         </Styles.Metrics>
      )
   return (
      <Styles.Metrics>
         <Styles.Metric>
            <span tw="text-gray-500">Total Income</span>
            <h3>
               {methods.format_currency(Number(overall['Total Income']) || 0)}
            </h3>
         </Styles.Metric>
         <Styles.Metric>
            <span tw="text-gray-500">Total Expense</span>
            <h3>
               {methods.format_currency(Number(overall['Total Expense']) || 0)}
            </h3>
         </Styles.Metric>
         <Styles.Metric>
            <span tw="text-gray-500">Balance</span>
            <h3>{methods.format_currency(Number(overall['Balance']) || 0)}</h3>
         </Styles.Metric>
      </Styles.Metrics>
   )
}

const ReportGrid = () => {
   const { methods } = useConfig()
   return (
      <_Styles.Container>
         <article id="a">
            <h2 tw="border-b border-dark-200 mx-3 text-xl h-12 flex items-center mb-3">
               Expenses By Year
            </h2>
            <ExpensesByYearChart methods={methods} />
         </article>
         <article id="b">
            <h2 tw="border-b border-dark-200 mx-3 text-xl h-12 flex items-center mb-3">
               Incomes By Years
            </h2>
            <IncomesByYearsChart methods={methods} />
         </article>
         <article id="c">
            <h2 tw="border-b border-dark-200 mx-3 text-xl h-12 flex items-center mb-3">
               Expenses By Categories
            </h2>
            <ExpensesByCategoriesChart methods={methods} />
         </article>
         <article id="d">
            <h2 tw="border-b border-dark-200 mx-3 text-xl h-12 flex items-center mb-3">
               Incomes By Categories
            </h2>
            <IncomesByCategoriesChart methods={methods} />
         </article>
      </_Styles.Container>
   )
}

const _Styles = {
   Container: styled.div`
      ${tw`mx-auto grid gap-3`}
      width: 100%;
      max-width: 1280px;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(5, 1fr);
      article {
         ${tw`border border-dark-200 rounded`}
      }
      article#a {
         height: 490px;
         grid-column: 1;
         grid-row: 1 / 3;
      }
      article#b {
         height: 490px;
         grid-column: 2;
         grid-row: 1 / 3;
      }
      article#c,
      article#d {
         height: 340px;
         grid-row: 3 / 5;
      }
      @media screen and (max-width: 1023px) {
         grid-template-rows: auto;
         grid-template-columns: 1fr;
         article#a {
            grid-row: unset;
            grid-column: unset;
         }
         article#b {
            grid-row: unset;
            grid-column: unset;
         }
         article#c,
         article#d {
            grid-row: unset;
         }
      }
   `,
}

const commonBarChartOptions = {
   grid: {
      top: '3%',
      right: '2%',
      bottom: '16%',
      left: '12%',
   },
}

const ExpensesByCategoriesChart = ({ methods }): JSX.Element => {
   const { loading, data: { expenses_by_categories = {} } = {} } =
      useSubscription(EXPENSES_BY_CATEGORIES, {
         variables: { order_by: { title: 'asc' } },
      })
   if (loading) return <Loader />
   return (
      <ReactEcharts
         style={{ width: '100%', height: '280px' }}
         option={{
            ...commonBarChartOptions,
            tooltip: {
               trigger: 'axis',
               formatter: props => {
                  const [node] = props
                  return `<span>
                        ${node.marker}
                        ${node.axisValue}
                        <h3 style="margin-top:8px; font-size: 24px">${methods.format_currency(
                           node.value
                        )}</h3>
                     </span>`
               },
            },
            xAxis: {
               type: 'category',
               data: expenses_by_categories.nodes.map(node => node.title),
            },
            yAxis: {
               type: 'value',
               axisLine: {
                  show: false,
               },
               splitLine: {
                  lineStyle: {
                     color: '#3b3936',
                  },
               },
               axisLabel: {
                  formatter: function (value) {
                     return methods.format_k(value)
                  },
               },
            },
            series: [
               {
                  type: 'bar',
                  itemStyle: {
                     color: 'rgb(223,247,95)',
                  },
                  data: expenses_by_categories.nodes.map(node => node.amount),
               },
            ],
         }}
      />
   )
}

const IncomesByCategoriesChart = ({ methods }): JSX.Element => {
   const { loading, data: { incomes_by_categories = {} } = {} } =
      useSubscription(INCOMES_BY_CATEGORIES, {
         variables: { order_by: { title: 'asc' } },
      })
   if (loading) return <Loader />
   return (
      <ReactEcharts
         style={{ width: '100%', height: '280px' }}
         option={{
            ...commonBarChartOptions,
            tooltip: {
               trigger: 'axis',
               formatter: props => {
                  const [node] = props
                  return `<span>
                           ${node.marker}
                           ${node.axisValue}
                           <h3 style="margin-top:8px; font-size: 24px">${methods.format_currency(
                              node.value
                           )}</h3>
                        </span>`
               },
            },
            xAxis: {
               type: 'category',
               data: incomes_by_categories.nodes.map(node => node.title),
            },
            yAxis: {
               type: 'value',
               axisLine: {
                  show: false,
               },
               splitLine: {
                  lineStyle: {
                     color: '#3b3936',
                  },
               },
               axisLabel: {
                  formatter: function (value) {
                     return methods.format_k(value)
                  },
               },
            },
            series: [
               {
                  type: 'bar',
                  itemStyle: {
                     color: 'rgb(223,247,95)',
                  },
                  data: incomes_by_categories.nodes.map(node => node.amount),
               },
            ],
         }}
      />
   )
}

const commonChartOptions = {
   legend: {
      top: '1%',
      left: 'center',
      textStyle: {
         color: '#fff',
      },
   },
}

const commonPieSeriesOptions = {
   type: 'pie',
   radius: ['40%', '80%'],
   avoidLabelOverlap: false,
   label: {
      show: false,
      position: 'center',
   },
   emphasis: {
      label: {
         color: '#fff',
         show: true,
         fontSize: '40',
         fontWeight: 'bold',
      },
   },
   labelLine: {
      show: false,
   },
}

const ExpensesByYearChart = ({ methods }): JSX.Element => {
   const { loading, data: { expenses_by_years = {} } = {} } =
      useSubscription(EXPENSES_BY_YEARS)
   if (loading) return <Loader />
   return (
      <ReactEcharts
         style={{ width: '100%', height: '430px' }}
         option={{
            ...commonChartOptions,
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
                  ...commonPieSeriesOptions,
                  data: expenses_by_years.nodes.map(node => ({
                     name: node.title,
                     value: node.amount,
                  })),
               },
            ],
         }}
      />
   )
}

const IncomesByYearsChart = ({ methods }): JSX.Element => {
   const { loading, data: { incomes_by_years = {} } = {} } =
      useSubscription(INCOMES_BY_YEARS)
   if (loading) return <Loader />
   return (
      <ReactEcharts
         style={{ width: '100%', height: '430px' }}
         option={{
            ...commonChartOptions,
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
                  ...commonPieSeriesOptions,
                  data: incomes_by_years.nodes.map(node => ({
                     name: node.title,
                     value: node.amount,
                  })),
               },
            ],
         }}
      />
   )
}
interface IChartData {
   title: string
   count: number
   amount: number
}

const TableView = () => {
   return (
      <main tw="grid grid-cols-1 md:grid-cols-2 border border-dark-200">
         <section tw="pb-3 overflow-x-auto">
            <h2 tw="border-b border-dark-200 mx-3 text-xl h-12 flex items-center">
               Expenses By Categories
            </h2>
            <ExpensesByCategoriesTable />
         </section>
         <section tw="pb-3 overflow-x-auto border-t border-dark-200 md:(border-t-0 border-l)">
            <h2 tw="border-b border-dark-200 mx-3 text-xl h-12 flex items-center">
               Expenses By Year
            </h2>
            <ExpensesByYearTable />
         </section>
         <section tw="pb-3 overflow-x-auto border-t border-dark-200">
            <h2 tw="border-b border-dark-200 mx-3 text-xl h-12 flex items-center">
               Incomes By Categories
            </h2>
            <IncomesByCategoriesTable />
         </section>
         <section tw="pb-3 overflow-x-auto border-t border-dark-200 md:(border-l)">
            <h2 tw="border-b border-dark-200 mx-3 text-xl h-12 flex items-center">
               Incomes By Years
            </h2>
            <IncomesByYearsTable />
         </section>
      </main>
   )
}

const ExpensesByCategoriesTable = (): JSX.Element => {
   const { loading, data: { expenses_by_categories = {} } = {} } =
      useSubscription(EXPENSES_BY_CATEGORIES, {
         variables: { order_by: { amount: 'desc' } },
      })
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
   if (loading) return <Loader />
   if (data.length === 0)
      return (
         <div tw="my-6 w-full flex items-center justify-center">
            <Svg.Empty message="No reports yet!" />
         </div>
      )
   return (
      <section tw="px-3">
         <Table>
            <Table.Head>
               <Table.Row noBg>
                  {columns.map(column => (
                     <Table.HCell
                        key={column.title}
                        is_right={column?.is_right}
                     >
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
      </section>
   )
}
