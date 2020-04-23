import React from 'react'

import { Header, Expenses, Earnings, Analytics, Form } from '../sections'

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
         {tab === 'expenses' && <Expenses />}
         {tab === 'earnings' && <Earnings />}
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
