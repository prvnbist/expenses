'use client'
import { useQuery } from '@/hooks'
import supabase from '@/lib/supabase'
import DataGrid from 'react-data-grid'
import { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
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
   const { addToast } = useToasts()
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
      const { error } = await supabase.from('transaction').delete().match({ id: row.id })

      if (error) {
         addToast(`Failed to delete the transaction.`, {
            appearance: 'error',
         })
         return
      }

      addToast(`Successfully deleted the transaction.`, {
         appearance: 'success',
      })
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
                           <div className="h-full flex items-center justify-center gap-2 mx-[-8px]">
                              <button
                                 title="Edit"
                                 onClick={() => handleEdit(row)}
                                 className="h-5 inline-flex w-5 items-center justify-center rounded hover:bg-[var(--dark-300)]"
                              >
                                 <EditIcon size={14} />
                              </button>
                              <button
                                 title="Delete"
                                 onClick={() => handleDelete(row)}
                                 className="h-5 inline-flex w-5 items-center justify-center rounded hover:bg-red-600"
                              >
                                 <TrashIcon size={14} />
                              </button>
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

const EditIcon = ({ size = 18, color = '#fff' }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
   </svg>
)

const TrashIcon = ({ size = 18, color = '#fff' }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
   </svg>
)
