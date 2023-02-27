import Dinero from 'dinero.js'
import merge from 'lodash.merge'
import * as echarts from 'echarts'
import supabase from '~/lib/supabase'
import { json } from '@remix-run/node'
import { useWindowSize } from '~/hooks'
import { useRef, useEffect } from 'react'
import { useLoaderData } from '@remix-run/react'

export async function loader() {
   try {
      let { data: top_categories = [], error } = await supabase.from('all_time_top_expense_categories').select('*')
      if (error) {
         throw error
      }

      let { data: yearly_expenses = [], error1 } = await supabase.from('yearly_expense').select('*')
      if (error1) {
         throw error1
      }

      let { data: yearly_incomes = [], error3 } = await supabase.from('yearly_income').select('*')
      if (error3) {
         throw error3
      }

      let { data: yearly_investments = [], error4 } = await supabase.from('yearly_investments').select('*')
      if (error4) {
         throw error4
      }

      return json({
         status: 200,
         yearly_investments,
         yearly_incomes,
         yearly_expenses,
         top_categories,
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
            <article>
               <TopCategories />
            </article>
            <article>
               <YearlyIncomesExpenses />
            </article>
            <article>
               <YearlyInvestments />
            </article>
         </div>
      </div>
   )
}

const chart_size = {
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

      const resize = () => {
         ref.current.resize()
      }
      window.addEventListener('resize', resize)

      return () => {
         window.removeEventListener('resize', resize)
      }
   }, [top_categories])

   return <div id="top-categories" />
}

const YearlyIncomesExpenses = () => {
   const ref = useRef()
   const size = useWindowSize()
   const { yearly_expenses, yearly_incomes } = useLoaderData()

   useEffect(() => {
      if (!ref.current) {
         const chart = echarts.init(document.getElementById('yearly-expenses'), 'dark', chart_size)
         ref.current = chart
      }

      const expenses = yearly_expenses.sort((a, b) => a.year - b.year)
      const incomes = yearly_incomes.sort((a, b) => a.year - b.year)

      ref.current.setOption(
         merge(
            {
               grid: {
                  left: size.width > 570 ? '16%' : '24%',
                  right: '5%',
               },
               title: {
                  text: 'Years breakdown (income v. expense)',
               },
               xAxis: {
                  type: 'category',
                  data: [...new Set([...expenses.map(item => item.year), ...incomes.map(item => item.year)])],
               },
               yAxis: {
                  type: 'value',
               },
               series: [
                  {
                     type: 'bar',
                     name: 'Expenses',
                     data: expenses.map(item => item.sum),
                  },
                  {
                     type: 'bar',
                     name: 'Incomes',
                     data: incomes.map(item => item.sum),
                  },
               ],
            },
            chart_options
         )
      )

      const resize = () => {
         ref.current.resize()
      }
      window.addEventListener('resize', resize)

      return () => {
         window.removeEventListener('resize', resize)
      }
   }, [yearly_expenses, size])

   return <div id="yearly-expenses" />
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

      const resize = () => {
         ref.current.resize()
      }
      window.addEventListener('resize', resize)

      return () => {
         window.removeEventListener('resize', resize)
      }
   }, [yearly_investments])

   return <div id="yearly-investments" />
}
