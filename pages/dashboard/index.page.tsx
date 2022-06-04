import React from 'react'
import Head from 'next/head'
import Dinero from 'dinero.js'
import { NextPage } from 'next'
import tw, { styled } from 'twin.macro'
import { ResponsivePie } from '@nivo/pie'
import { useQuery } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'

import { useUser } from 'lib/user'
import Layout from 'sections/layout'
import QUERIES from 'graphql/queries'
import { Loader, Table } from '../../components'

interface ITotalIncomeOrExpense {
   count: number
   amount: number
}

interface IExpenseIncomeCategory {
   title: string
   count: number
   sum: number
}

interface IAnalyticsState {
   total_income?: ITotalIncomeOrExpense
   total_expense?: ITotalIncomeOrExpense
   top_five_expense_categories?: Array<IExpenseIncomeCategory>
   top_five_income_categories?: Array<IExpenseIncomeCategory>
}

const Dashboard: NextPage = (): JSX.Element => {
   const { user } = useUser()
   const { addToast } = useToasts()
   const [loading, setLoading] = React.useState(true)
   const [analytics, setAnalytics] = React.useState<IAnalyticsState>({})

   useQuery(QUERIES.TRANSACTIONS.ANALYTICS, {
      skip: !user?.id,
      variables: { userid: user?.id },
      onCompleted: ({ transactions_analytics = [] }) => {
         const _analytics: IAnalyticsState = transactions_analytics.reduce(
            (
               result = {},
               current:
                  | { title: string; data: ITotalIncomeOrExpense }
                  | { title: string; data: Array<IExpenseIncomeCategory> }
            ) => {
               result[current.title] = current.data
               return result
            },
            {}
         )
         setAnalytics(_analytics)
         setLoading(false)
      },
      onError: () => {
         addToast('Failed to fetch analytics', {
            appearance: 'error',
         })
         setLoading(false)
      },
   })

   return (
      <Layout>
         <Head>
            <title>Transactions</title>
         </Head>
         <header tw="px-4 pt-4 flex">
            <h1 tw="font-heading text-2xl font-medium text-gray-400">
               Dashboard
            </h1>
         </header>
         {loading ? (
            <Loader />
         ) : (
            <main tw="mt-4 px-4">
               <ul tw="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <li>
                     <h3 tw="text-lg mb-2 text-gray-400">Overview</h3>
                     <TotalIncomeExpense
                        total_income={analytics.total_income}
                        total_expense={analytics.total_expense}
                     />
                  </li>
                  <li>
                     <h3 tw="text-lg mb-2 text-gray-400">
                        Expense by Categories
                     </h3>
                     <TopFiveExpenseCategories
                        data={analytics?.top_five_expense_categories || []}
                     />
                  </li>
                  <li>
                     <h3 tw="text-lg mb-2 text-gray-400">
                        Income by Categories
                     </h3>
                     <TopFiveIncomeCategories
                        data={analytics?.top_five_income_categories || []}
                     />
                  </li>
               </ul>
            </main>
         )}
      </Layout>
   )
}

export default Dashboard

const pieChartOptions = {
   margin: { top: 40, right: 80, bottom: 20, left: 80 },
   innerRadius: 0.5,
   padAngle: 0.7,
   cornerRadius: 3,
   activeOuterRadiusOffset: 8,
   borderWidth: 1,
   borderColor: {
      from: 'color',
      modifiers: [['darker', 0.2]],
   },
   enableArcLabels: false,
   arcLinkLabelsSkipAngle: 10,
   arcLinkLabelsTextColor: '#fff',
   arcLinkLabelsThickness: 2,
   arcLinkLabelsColor: { from: 'color' },
}

const TotalIncomeExpense = ({
   total_income,
   total_expense,
}: {
   total_income: { count: number; amount: number }
   total_expense: { count: number; amount: number }
}): JSX.Element => {
   const [tab, setTab] = React.useState('chart')

   return (
      <div>
         <Styles.Tabs>
            <Styles.Tab
               is_active={tab === 'chart'}
               onClick={() => setTab('chart')}
            >
               Chart
            </Styles.Tab>
            <Styles.Tab
               is_active={tab === 'table'}
               onClick={() => setTab('table')}
            >
               Table
            </Styles.Tab>
         </Styles.Tabs>
         <Styles.Panel is_active={tab === 'chart'}>
            <ResponsivePie
               data={[
                  {
                     id: 'Total Income',
                     label: 'Total Income',
                     value: total_income.amount,
                  },
                  {
                     id: 'Total Expense',
                     label: 'Total Expense',
                     value: total_expense.amount,
                  },
               ]}
               valueFormat={value =>
                  Dinero({
                     amount: value,
                     currency: 'INR',
                  }).toFormat()
               }
               {...pieChartOptions}
            />
         </Styles.Panel>
         <Styles.Panel is_active={tab === 'table'}>
            <Table>
               <Table.Head>
                  <Table.Row>
                     <Table.HCell>Title</Table.HCell>
                     <Table.HCell is_right>Count</Table.HCell>
                     <Table.HCell is_right>Total</Table.HCell>
                  </Table.Row>
               </Table.Head>
               <Table.Body>
                  <Table.Row>
                     <Table.Cell>Total Income</Table.Cell>
                     <Table.Cell is_right>
                        <span tw="font-mono">{total_income.count}</span>
                     </Table.Cell>
                     <Table.Cell is_right>
                        <span tw="font-mono">
                           {Dinero({
                              amount: total_income.amount,
                              currency: 'INR',
                           }).toFormat()}
                        </span>
                     </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                     <Table.Cell>Total Expense</Table.Cell>
                     <Table.Cell is_right>
                        <span tw="font-mono">{total_expense.count}</span>
                     </Table.Cell>
                     <Table.Cell is_right>
                        <span tw="font-mono">
                           {Dinero({
                              amount: total_expense.amount,
                              currency: 'INR',
                           }).toFormat()}
                        </span>
                     </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                     <Table.Cell>Balance</Table.Cell>
                     <Table.Cell is_right />
                     <Table.Cell is_right>
                        <span tw="font-mono">
                           {Dinero({
                              amount:
                                 total_income.amount - total_expense.amount,
                              currency: 'INR',
                           }).toFormat()}
                        </span>
                     </Table.Cell>
                  </Table.Row>
               </Table.Body>
            </Table>
         </Styles.Panel>
      </div>
   )
}

const TopFiveExpenseCategories = ({
   data,
}: {
   data: Array<IExpenseIncomeCategory>
}): JSX.Element => {
   const [tab, setTab] = React.useState('chart')

   return (
      <div>
         <Styles.Tabs>
            <Styles.Tab
               is_active={tab === 'chart'}
               onClick={() => setTab('chart')}
            >
               Chart
            </Styles.Tab>
            <Styles.Tab
               is_active={tab === 'table'}
               onClick={() => setTab('table')}
            >
               Table
            </Styles.Tab>
         </Styles.Tabs>
         <Styles.Panel is_active={tab === 'chart'}>
            <ResponsivePie
               data={data.map(row => ({
                  id: row.title,
                  label: row.title,
                  value: row.sum,
               }))}
               valueFormat={value =>
                  Dinero({
                     amount: value,
                     currency: 'INR',
                  }).toFormat()
               }
               {...pieChartOptions}
            />
         </Styles.Panel>
         <Styles.Panel is_active={tab === 'table'}>
            <Table>
               <Table.Head>
                  <Table.Row>
                     <Table.HCell>Title</Table.HCell>
                     <Table.HCell is_right>Count</Table.HCell>
                     <Table.HCell is_right>Total</Table.HCell>
                  </Table.Row>
               </Table.Head>
               <Table.Body>
                  {data.map(row => (
                     <Table.Row key={row.title}>
                        <Table.Cell>{row.title}</Table.Cell>
                        <Table.Cell is_right>
                           <span tw="font-mono">{row.count}</span>
                        </Table.Cell>
                        <Table.Cell is_right>
                           <span tw="font-mono">
                              {Dinero({
                                 amount: row.sum,
                                 currency: 'INR',
                              }).toFormat()}
                           </span>
                        </Table.Cell>
                     </Table.Row>
                  ))}
                  <Table.Row>
                     <Table.Cell>Total</Table.Cell>
                     <Table.Cell is_right>
                        <span tw="font-mono">
                           {data.reduce(
                              (total, current) => total + current.count,
                              0
                           )}
                        </span>
                     </Table.Cell>
                     <Table.Cell is_right>
                        <span tw="font-mono">
                           {Dinero({
                              amount: data.reduce(
                                 (total, current) => total + current.sum,
                                 0
                              ),
                              currency: 'INR',
                           }).toFormat()}
                        </span>
                     </Table.Cell>
                  </Table.Row>
               </Table.Body>
            </Table>
         </Styles.Panel>
      </div>
   )
}

const TopFiveIncomeCategories = ({
   data,
}: {
   data: Array<IExpenseIncomeCategory>
}): JSX.Element => {
   const [tab, setTab] = React.useState('chart')

   return (
      <div>
         <Styles.Tabs>
            <Styles.Tab
               is_active={tab === 'chart'}
               onClick={() => setTab('chart')}
            >
               Chart
            </Styles.Tab>
            <Styles.Tab
               is_active={tab === 'table'}
               onClick={() => setTab('table')}
            >
               Table
            </Styles.Tab>
         </Styles.Tabs>
         <Styles.Panel is_active={tab === 'chart'}>
            <ResponsivePie
               data={data.map(row => ({
                  id: row.title,
                  label: row.title,
                  value: row.sum,
               }))}
               valueFormat={value =>
                  Dinero({
                     amount: value,
                     currency: 'INR',
                  }).toFormat()
               }
               {...pieChartOptions}
            />
         </Styles.Panel>
         <Styles.Panel is_active={tab === 'table'}>
            <Table>
               <Table.Head>
                  <Table.Row>
                     <Table.HCell>Title</Table.HCell>
                     <Table.HCell is_right>Count</Table.HCell>
                     <Table.HCell is_right>Total</Table.HCell>
                  </Table.Row>
               </Table.Head>
               <Table.Body>
                  {data.map(row => (
                     <Table.Row key={row.title}>
                        <Table.Cell>{row.title}</Table.Cell>
                        <Table.Cell is_right>
                           <span tw="font-mono">{row.count}</span>
                        </Table.Cell>
                        <Table.Cell is_right>
                           <span tw="font-mono">
                              {Dinero({
                                 amount: row.sum,
                                 currency: 'INR',
                              }).toFormat()}
                           </span>
                        </Table.Cell>
                     </Table.Row>
                  ))}
                  <Table.Row>
                     <Table.Cell>Total</Table.Cell>
                     <Table.Cell is_right>
                        <span tw="font-mono">
                           {data.reduce(
                              (total, current) => total + current.count,
                              0
                           )}
                        </span>
                     </Table.Cell>
                     <Table.Cell is_right>
                        <span tw="font-mono">
                           {Dinero({
                              amount: data.reduce(
                                 (total, current) => total + current.sum,
                                 0
                              ),
                              currency: 'INR',
                           }).toFormat()}
                        </span>
                     </Table.Cell>
                  </Table.Row>
               </Table.Body>
            </Table>
         </Styles.Panel>
      </div>
   )
}

const Styles = {
   Tabs: styled('div', { ...tw`mb-2 border-b border-dark-300` }),
   Tab: styled('button', {
      ...tw`px-2 h-8 text-gray-500 text-sm border-b-2 border-transparent`,
      variants: {
         is_active: {
            true: {
               ...tw`text-white border-indigo-500`,
            },
         },
      },
   }),
   Panel: styled('section', {
      ...tw`hidden w-full h-[240px]`,
      variants: {
         is_active: {
            true: { ...tw`block` },
         },
      },
   }),
}
