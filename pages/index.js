import React from 'react'

import {
   Header,
   Expenses,
   Earnings,
   EarningsMetrics,
   ExpensesMetrics,
   Analytics,
   Form,
} from '../sections'

import { Tab } from '../components'

export default () => {
   const [isFormVisible, setIsFormVisible] = React.useState(false)
   const [tab, setTab] = React.useState('expenses')

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
            <Tab type="analytics" tab={tab} onClick={() => setTab('analytics')}>
               Analytics
            </Tab>
         </div>
         {tab === 'expenses' && (
            <div className="flex">
               <div className="w-9/12 mr-4">
                  <h1 className="mt-4 text-xl text-teal-600 border-b pb-1">
                     Expenses
                  </h1>
                  <Expenses />
               </div>
               <div className="w-3/12">
                  <h1 className="mt-4 text-xl text-teal-600 border-b pb-1">
                     Analytics
                  </h1>
                  <ExpensesMetrics />
               </div>
            </div>
         )}
         {tab === 'earnings' && (
            <div className="flex">
               <div className="w-9/12 mr-4">
                  <h1 className="mt-4 text-xl text-teal-600 border-b pb-1">
                     Earnings
                  </h1>
                  <Earnings />
               </div>
               <div className="w-3/12">
                  <h1 className="mt-4 text-xl text-teal-600 border-b pb-1">
                     Analytics
                  </h1>
                  <EarningsMetrics />
               </div>
            </div>
         )}
         {tab === 'analytics' && <Analytics />}
         <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="h-16 w-16 text-white fixed right-0 top-0 mr-6 mt-6 rounded-full bg-teal-600 hover:bg-teal-700"
         >
            Add
         </button>
         {isFormVisible && <Form setIsFormVisible={setIsFormVisible} />}
      </div>
   )
}
