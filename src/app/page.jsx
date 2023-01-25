'use client'
import { useQuery } from '@/hooks'
import supabase from '@/lib/supabase'
import DataGrid from 'react-data-grid'
import { useEffect, useState } from 'react'
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
   const [selectedRow, setSelectedRow] = useState(null)

   useEffect(() => {
      if (!isModalOpen) {
         setSelectedRow(null)
      }
   }, [isModalOpen])

   const { status, error, data } = useQuery({
      table: 'transactions',
      columns: `*`,
      order: [
         { key: 'date', direction: 'desc' },
         { key: 'title', direction: 'asc' },
      ],
   })

   const handleEdit = row => {
      setSelectedRow(row)
      setIsModalOpen(true)
   }

   const handleDelete = async row => {
      await supabase.from('transaction').delete().match({ id: row.id })
   }

   return (
      <>
         <header className="flex item-center gap-3 mt-4 mb-3">
            <h2 className="text-2xl font-medium text-white">Transactions</h2>
            <button
               type="button"
               title="Create Transaction"
               onClick={() => setIsModalOpen(true)}
               className="bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center mr-2 hover:bg-blue-700 focus:ring-blue-800"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
               <DataGrid
                  columns={[
                     ...columns,
                     {
                        key: 'actions',
                        name: 'Actions',
                        width: 120,
                        formatter: ({ row }) => (
                           <div>
                              <button onClick={() => handleEdit(row)}>Edit</button>
                              <button onClick={() => handleDelete(row)}>delete</button>
                           </div>
                        ),
                     },
                  ]}
                  rows={data}
                  rowHeight={28}
               />
            </main>
         </Renderer>
         <CreateTransactionForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} data={selectedRow} />
      </>
   )
}
