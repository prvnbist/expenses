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
   return (
      <div>
         <Header />
         <div>
            <Tab type="expenses" tab={tab} onClick={() => setTab('expenses')}>
               Expenses
            </Tab>
            <Tab type="earnings" tab={tab} onClick={() => setTab('earnings')}>
               Earning
            </Tab>
         </div>
         {tab === 'expenses' && (
            <div className="flex">
               <div className="w-9/12 mr-4">
                  <Expenses />
               </div>
               <div className="w-3/12">
                  <ExpensesMetrics />
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
