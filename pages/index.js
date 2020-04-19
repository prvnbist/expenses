import React from 'react'

import {
   Header,
   Expenses,
   Earnings,
   EarningsMetrics,
   ExpensesMetrics,
} from '../sections'

import { Tab } from '../components'

export default () => {
   const [tab, setTab] = React.useState('expenses')
   const [categories] = React.useState([
      'Accessories',
      'Clothing & Footwears',
      'Entertainment',
      'Family',
      'Food & Drinks',
      'Friends',
      'Groceries',
      'Health Care',
      'Internet/Talktime',
      'Others',
      'Rent',
      'Repairs',
      'Stationary',
      'Transportation',
      'Trip',
      'Vehicle',
   ])

   return (
      <div>
         <Header />
         <div className="rounded-lg border">
            <Tab type="expenses" tab={tab} onClick={() => setTab('expenses')}>
               Expenses
            </Tab>
            <Tab type="earnings" tab={tab} onClick={() => setTab('earnings')}>
               Earning
            </Tab>
         </div>
         {tab === 'expenses' && (
            <div>
               <section className="w-full flex-1 flex flex-wrap items-center mt-4 mb-3">
                  <h1 className="mr-3 uppercase text-gray-600">Filters:</h1>
                  <input
                     type="text"
                     placeholder="Search Expenses..."
                     className="mr-3 border rounded h-8 px-2"
                  />
                  <select
                     name="categories"
                     id="categories"
                     className="mr-3 border rounded h-8 px-2"
                  >
                     {categories.map((category, index) => (
                        <option key={index} value={category}>
                           {category}
                        </option>
                     ))}
                  </select>
                  <div className="border rounded">
                     <input type="date" className="mr-3 border-r-1 h-8 px-2" />
                     <input type="date" className="mr-3 h-8 px-2" />
                  </div>
               </section>
               <div className="flex">
                  <div className="w-9/12 mr-4">
                     <Expenses />
                  </div>
                  <div className="w-3/12">
                     <ExpensesMetrics />
                  </div>
               </div>
            </div>
         )}
         {tab === 'earnings' && (
            <div className="flex">
               <div className="w-9/12 mr-4">
                  <Earnings />
               </div>
               <div className="w-3/12">
                  <EarningsMetrics />
               </div>
            </div>
         )}
      </div>
   )
}
