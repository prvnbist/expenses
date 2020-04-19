import React from 'react'

import { User, Expenses } from '../sections'

import { Tab } from '../components'

export default () => {
   const [tab, setTab] = React.useState('expenses')
   return (
      <div>
         <User />
         <div>
            <Tab type="expenses" tab={tab} onClick={() => setTab('expenses')}>
               Expenses
            </Tab>
            <Tab type="earnings" tab={tab} onClick={() => setTab('earnings')}>
               Earning
            </Tab>
         </div>
         {tab === 'expenses' && <Expenses />}
         {tab === 'earnings' && <div>earnings</div>}
      </div>
   )
}
