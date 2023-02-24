import Dinero from 'dinero.js'
import merge from 'lodash.merge'
import * as echarts from 'echarts'
import supabase from '~/lib/supabase'
import { json } from '@remix-run/node'
import { useRef, useEffect } from 'react'
import { useLoaderData } from '@remix-run/react'

export async function loader() {
   try {
      // let { data: top_categories = [], error } = await supabase.from('all_time_top_expense_categories').select('*')
      // if (error) {
      //    throw error
      // }

      // let { data: yearly_expenses = [], error1 } = await supabase.from('yearly_expense').select('*')
      // if (error1) {
      //    throw error1
      // }

      // let { data: yearly_incomes = [], error3 } = await supabase.from('yearly_income').select('*')
      // if (error3) {
      //    throw error3
      // }

      // let { data: yearly_investments = [], error4 } = await supabase.from('yearly_investments').select('*')
      // if (error4) {
      //    throw error4
      // }

      return json({
         status: 200,
         yearly_investments: [
            {
               year: 2023,
               sum: 11100000,
            },
            {
               year: 2022,
               sum: 36000000,
            },
            {
               year: 2021,
               sum: 8565200,
            },
         ],
         yearly_incomes: [
            {
               year: 2023,
               sum: 11719400,
            },
            {
               year: 2022,
               sum: 112280975,
            },
            {
               year: 2021,
               sum: 74461200,
            },
            {
               year: 2020,
               sum: 65748500,
            },
            {
               year: 2019,
               sum: 30750000,
            },
            {
               year: 2018,
               sum: 5350000,
            },
            {
               year: 2017,
               sum: 3950000,
            },
         ],
         yearly_expenses: [
            {
               year: 2023,
               sum: 13272332,
            },
            {
               year: 2022,
               sum: 63471283,
            },
            {
               year: 2021,
               sum: 54842256,
            },
            {
               year: 2020,
               sum: 68460800,
            },
            {
               year: 2019,
               sum: 20062000,
            },
            {
               year: 2018,
               sum: 5614100,
            },
            {
               year: 2017,
               sum: 3268900,
            },
         ],
         top_categories: [
            {
               id: 'ec0ca903-b62e-4eaa-9fe5-6185450f1c40',
               total: 133867534,
               title: 'Family',
            },
            {
               id: '45c834aa-059e-46c0-a4d5-2a4a9a389835',
               total: 22458766,
               title: 'Food & Drinks',
            },
            {
               id: 'f9f03508-4b42-44c2-9c3c-cae69faaa116',
               total: 21139740,
               title: 'Bills & Services',
            },
            {
               id: 'ffcb506f-6c3f-4415-ac24-12c6142f2dad',
               total: 16279500,
               title: 'Electronics & Hardware',
            },
            {
               id: '623ac109-d995-42f3-96ba-3cb930d51d56',
               total: 7798800,
               title: 'Apparel',
            },
         ],
      })
   } catch (error) {
      console.log(error)
      return json({ status: 500 })
   }
}

export default function Home() {
   return (
      <div id="analytics">
         <h2 className="heading2">Analytics</h2>
         <div className="spacer-md" />
         <div className="analytic-cards">
            <TopCategories />
            <YearlyExpenses />
            <YearlyIncomes />
            <YearlyInvestments />
         </div>
      </div>
   )
}

const chart_size = {
   width: 316,
   height: 316,
}

const chart_options = {
   title: {
      top: '3%',
      left: 'center',
      textStyle: {
         fontSize: '14px',
      },
   },
   backgroundColor: '#282828',
   tooltip: {
      confine: true,
      trigger: 'item',
      valueFormatter: value => Dinero({ amount: value, currency: 'INR' }).toFormat(),
   },
   legend: {
      type: 'scroll',
      orient: 'horizontal',
      bottom: 'bottom',
      padding: 14,
      pageTextStyle: {
         color: '#fff',
      },
   },
}

const TopCategories = () => {
   const ref = useRef()
   const { top_categories } = useLoaderData()

   useEffect(() => {
      if (!ref.current) {
         const chart = echarts.init(document.getElementById('top-categories'), 'dark', chart_size)
         ref.current = chart
      }

      const list = top_categories.sort((a, b) => b.total - a.total)

      ref.current.setOption(
         merge(
            {
               title: {
                  text: 'Top Categories(expense)',
               },
               series: [
                  {
                     type: 'pie',
                     radius: '50%',
                     name: 'Categories',
                     data: list.map(item => ({ value: item.total, name: item.title })),
                  },
               ],
            },
            chart_options
         )
      )
   }, [top_categories])

   return <div id="top-categories" />
}

const YearlyExpenses = () => {
   const ref = useRef()
   const { yearly_expenses } = useLoaderData()

   useEffect(() => {
      if (!ref.current) {
         const chart = echarts.init(document.getElementById('yearly-expenses'), 'dark', chart_size)
         ref.current = chart
      }

      const list = yearly_expenses.sort((a, b) => b.year - a.year)

      ref.current.setOption(
         merge(
            {
               title: {
                  text: 'Expenses by Year',
               },
               series: [
                  {
                     type: 'pie',
                     radius: '50%',
                     name: 'Years',
                     data: list.map(item => ({ value: item.sum, name: item.year })),
                  },
               ],
            },
            chart_options
         )
      )
   }, [yearly_expenses])

   return <div id="yearly-expenses" />
}

const YearlyIncomes = () => {
   const ref = useRef()
   const { yearly_incomes } = useLoaderData()

   useEffect(() => {
      if (!ref.current) {
         const chart = echarts.init(document.getElementById('yearly-incomes'), 'dark', chart_size)
         ref.current = chart
      }

      const list = yearly_incomes.sort((a, b) => b.year - a.year)

      ref.current.setOption(
         merge(
            {
               title: {
                  text: 'Incomes by Year',
               },
               series: [
                  {
                     type: 'pie',
                     radius: '50%',
                     name: 'Years',
                     data: list.map(item => ({ value: item.sum, name: item.year })),
                  },
               ],
            },
            chart_options
         )
      )
   }, [yearly_incomes])

   return <div id="yearly-incomes" />
}

const YearlyInvestments = () => {
   const ref = useRef()
   const { yearly_investments } = useLoaderData()

   useEffect(() => {
      if (!ref.current) {
         const chart = echarts.init(document.getElementById('yearly-investments'), 'dark', chart_size)
         ref.current = chart
      }

      const list = yearly_investments.sort((a, b) => b.year - a.year)

      ref.current.setOption(
         merge(
            {
               title: {
                  text: 'Investments by Year',
               },
               series: [
                  {
                     type: 'pie',
                     radius: '50%',
                     name: 'Years',
                     data: list.map(item => ({ value: item.sum, name: item.year })),
                  },
               ],
            },
            chart_options
         )
      )
   }, [yearly_investments])

   return <div id="yearly-investments" />
}
