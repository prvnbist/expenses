import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import { USERS } from '../queries'

import { formatCurrency } from '../utils'

export const User = () => {
   const { loading, error, data: { users = [] } = {} } = useQuery(USERS)

   if (loading) return <div>Loading...</div>
   if (error) return <div>{error.message}</div>
   return (
      <section className="flex mb-4">
         <main className="mr-3 flex flex-col bg-red-400 p-3 rounded-lg">
            <h3 className="uppercase text-red-800 tracking-wider">
               Total Expenses
            </h3>
            <span className="text-3xl font-bold text-white">
               {formatCurrency(users[0].total_expenses)}
            </span>
         </main>
         <main className="flex flex-col bg-indigo-400 p-3 rounded-lg">
            <h3 className="uppercase text-indigo-800 tracking-wider">
               Total Earning
            </h3>
            <span className="text-3xl font-bold text-white">
               {formatCurrency(users[0].total_earnings)}
            </span>
         </main>
      </section>
   )
}
