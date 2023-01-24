'use client'
import { useState } from 'react'
import { useQuery } from '@/hooks'
import DataGrid from 'react-data-grid'
import { CreateTransactionForm, Renderer } from '@/components'

const columns = [
   { key: 'title', name: 'Title' },
   { key: 'amount', name: 'Amount' },
   { key: 'date', name: 'Date' },
   { key: 'payment_method', name: 'Payment Method' },
   { key: 'account', name: 'Account' },
   { key: 'category', name: 'Category' },
   { key: 'group', name: 'Group' },
   { key: 'type', name: 'Type' },
]

export default function Home() {
   const [isModalOpen, setIsModalOpen] = useState(false)
   const { status, error, data } = useQuery({
      table: 'transactions',
      columns: `*`,
      order: [
         { key: 'date', direction: 'desc' },
         { key: 'title', direction: 'asc' },
      ],
   })
   return (
      <div className="p-6">
         <header className="flex item-center gap-3 mt-4 mb-3">
            <h2 className="text-2xl font-medium text-white">Transactions</h2>
            <button
               type="button"
               onClick={() => setIsModalOpen(true)}
               class="bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center mr-2 hover:bg-blue-700 focus:ring-blue-800"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
               </svg>
            </button>
         </header>
         <Renderer status={status} error={error}>
            <main>
               <DataGrid columns={columns} rows={data} rowHeight={28} />
            </main>
         </Renderer>
         <CreateTransactionForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>
   )
}
