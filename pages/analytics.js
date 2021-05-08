import React from 'react'
import tw, { styled } from 'twin.macro'
import { useSubscription } from '@apollo/client'

import { Layout } from '../sections'
import { useConfig } from '../context'
import { Table, TableLoader } from '../components'
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
   Main: styled.main`
      ${tw`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-3`}
   `,
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

const Analytics = () => {
   const { methods } = useConfig()
   return (
      <Layout>
         <header>
            <Metrics methods={methods} />
         </header>
         <Styles.Main>
            <section tw="overflow-x-auto bg-gray-900 px-3 py-3 rounded">
               <h2 tw="text-2xl mb-2">Expenses By Categories</h2>
               <ExpensesByCategories methods={methods} />
            </section>
            <section tw="overflow-x-auto bg-gray-900 px-3 py-3 rounded">
               <h2 tw="text-2xl mb-2">Expenses By Years</h2>
               <ExpensesByYears methods={methods} />
            </section>
            <section tw="overflow-x-auto bg-gray-900 px-3 py-3 rounded">
               <h2 tw="text-2xl mb-2">Expenses By Months</h2>
               <ExpensesByMonths methods={methods} />
            </section>
            <section tw="overflow-x-auto bg-gray-900 px-3 py-3 rounded">
               <h2 tw="text-2xl mb-2">Incomes By Categories</h2>
               <IncomesByCategories methods={methods} />
            </section>
            <section tw="overflow-x-auto bg-gray-900 px-3 py-3 rounded">
               <h2 tw="text-2xl mb-2">Incomes By Years</h2>
               <IncomesByYears methods={methods} />
            </section>
            <section tw="overflow-x-auto bg-gray-900 px-3 py-3 rounded">
               <h2 tw="text-2xl mb-2">Incomes By Months</h2>
               <IncomesByMonths methods={methods} />
            </section>
         </Styles.Main>
      </Layout>
   )
}

export default Analytics

const Metrics = ({ methods }) => {
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

const ExpensesByCategories = ({ methods }) => {
   const {
      loading,
      data: { expenses_by_categories = {} } = {},
   } = useSubscription(EXPENSES_BY_CATEGORIES)
   if (loading) return <TableLoader cols={3} cols={3} />
   return (
      <Table>
         <Table.Head>
            <Table.Row noBg>
               <Table.HCell>Category</Table.HCell>
               <Table.HCell is_right>Amount</Table.HCell>
               <Table.HCell is_right>Total</Table.HCell>
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {expenses_by_categories.nodes.map((node, index) => (
               <Table.Row key={node.title} odd={index % 2 === 0}>
                  <Table.Cell>{node.title}</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-red-400">
                        - {methods.format_currency(Number(node.amount) || 0)}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{node.count}</Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}

const ExpensesByYears = ({ methods }) => {
   const { loading, data: { expenses_by_years = {} } = {} } = useSubscription(
      EXPENSES_BY_YEARS
   )
   if (loading) return <TableLoader cols={3} cols={3} />
   return (
      <Table>
         <Table.Head>
            <Table.Row noBg>
               <Table.HCell>Year</Table.HCell>
               <Table.HCell is_right>Amount</Table.HCell>
               <Table.HCell is_right>Total</Table.HCell>
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {expenses_by_years.nodes.map((node, index) => (
               <Table.Row key={node.year} odd={index % 2 === 0}>
                  <Table.Cell>{node.year}</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-red-400">
                        - {methods.format_currency(Number(node.amount) || 0)}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{node.count}</Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}

const ExpensesByMonths = ({ methods }) => {
   const { loading, data: { expenses_by_months = {} } = {} } = useSubscription(
      EXPENSES_BY_MONTHS
   )
   if (loading) return <TableLoader cols={3} cols={3} />
   return (
      <Table>
         <Table.Head>
            <Table.Row noBg>
               <Table.HCell>Year</Table.HCell>
               <Table.HCell is_right>Amount</Table.HCell>
               <Table.HCell is_right>Total</Table.HCell>
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {expenses_by_months.nodes.map((node, index) => (
               <Table.Row key={node.title} odd={index % 2 === 0}>
                  <Table.Cell>{node.title}</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-red-400">
                        - {methods.format_currency(Number(node.amount) || 0)}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{node.count}</Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}

const IncomesByCategories = ({ methods }) => {
   const {
      loading,
      data: { incomes_by_categories = {} } = {},
   } = useSubscription(INCOMES_BY_CATEGORIES)
   if (loading) return <TableLoader cols={3} cols={3} />
   return (
      <Table>
         <Table.Head>
            <Table.Row noBg>
               <Table.HCell>Category</Table.HCell>
               <Table.HCell is_right>Amount</Table.HCell>
               <Table.HCell is_right>Total</Table.HCell>
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {incomes_by_categories.nodes.map((node, index) => (
               <Table.Row key={node.title} odd={index % 2 === 0}>
                  <Table.Cell>{node.title}</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-indigo-400">
                        + {methods.format_currency(Number(node.amount) || 0)}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{node.count}</Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}

const IncomesByYears = ({ methods }) => {
   const { loading, data: { incomes_by_years = {} } = {} } = useSubscription(
      INCOMES_BY_YEARS
   )
   if (loading) return <TableLoader cols={3} cols={3} />
   return (
      <Table>
         <Table.Head>
            <Table.Row noBg>
               <Table.HCell>Year</Table.HCell>
               <Table.HCell is_right>Amount</Table.HCell>
               <Table.HCell is_right>Total</Table.HCell>
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {incomes_by_years.nodes.map((node, index) => (
               <Table.Row key={node.year} odd={index % 2 === 0}>
                  <Table.Cell>{node.year}</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-indigo-400">
                        + {methods.format_currency(Number(node.amount) || 0)}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{node.count}</Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}

const IncomesByMonths = ({ methods }) => {
   const { loading, data: { incomes_by_months = {} } = {} } = useSubscription(
      INCOMES_BY_MONTHS
   )
   if (loading) return <TableLoader cols={3} />
   return (
      <Table>
         <Table.Head>
            <Table.Row noBg>
               <Table.HCell>Year</Table.HCell>
               <Table.HCell is_right>Amount</Table.HCell>
               <Table.HCell is_right>Total</Table.HCell>
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {incomes_by_months.nodes.map((node, index) => (
               <Table.Row key={node.title} odd={index % 2 === 0}>
                  <Table.Cell>{node.title}</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-indigo-400">
                        + {methods.format_currency(Number(node.amount) || 0)}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{node.count}</Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}
