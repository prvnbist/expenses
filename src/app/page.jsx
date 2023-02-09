'use client'
import { get } from '@/utils'
import Dinero from 'dinero.js'
import { create } from 'zustand'
import { useQuery } from '@/hooks'
import supabase from '@/lib/supabase'
import DataGrid from 'react-data-grid'
import { shallow } from 'zustand/shallow'
import { useToasts } from 'react-toast-notifications'
import { CreateTransactionForm, Renderer } from '@/components'
import { useCallback, useEffect, useMemo, useState } from 'react'

const useFilterStore = create((set, get) => ({
   filters: new Map(),
   update: payload => {
      let _filters = new Map(get().filters)
      if (!_filters.has(payload.column)) {
         _filters.set(payload.column, [payload.value])
      } else {
         const current = _filters.get(payload.column)
         if (current.includes(payload.value)) {
            if (current.length === 1) {
               _filters.delete(payload.column)
            } else {
               _filters.set(
                  payload.column,
                  current.filter(f => f !== payload.value)
               )
            }
         } else {
            _filters.set(payload.column, [...current, payload.value])
         }
      }

      set({ filters: _filters })
   },
}))

export default function Home() {
   const { addToast } = useToasts()
   const [order] = useState([
      { key: 'date', direction: 'desc' },
      { key: 'title', direction: 'asc' },
   ])
   const [data, setData] = useState([])
   const [error, setError] = useState(null)
   const [status, setStatus] = useState('IDLE')
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [selectedRow, setSelectedRow] = useState(null)
   const filters = useFilterStore(state => state.filters, shallow)
   const updateFilters = useFilterStore(state => state.update)

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

   const selectFilter = useCallback(
      (e, { column, value }) => {
         e.stopPropagation()
         updateFilters({ column, value })
      },
      [filters]
   )

   const columns = useMemo(
      () => [
         { key: 'title', name: 'Title', resizable: true },
         {
            key: 'amount',
            name: 'Amount',
            cellClass: 'text-right',
            headerCellClass: 'text-right',
            formatter: ({ row }) => {
               return (
                  <span className={`${row.type === 'expense' ? 'text-red-500' : 'text-blue-400'}`}>
                     {(row.type === 'expense' ? '- ' : '+ ') +
                        Dinero({ amount: row.amount, currency: 'INR' }).toFormat()}
                  </span>
               )
            },
         },
         { key: 'date', name: 'Date', cellClass: 'text-right', headerCellClass: 'text-right' },
         { key: 'payment_method', name: 'Payment Method' },
         { key: 'account', name: 'Account' },
         { key: 'category', name: 'Category' },
         { key: 'group', name: 'Group' },
         {
            key: 'type',
            name: 'Type',
            formatter: ({ row }) => (
               <div className="table-column_type">
                  <button className="pill" onClick={e => selectFilter(e, { column: 'type', value: row.type })}>
                     {row.type}
                  </button>
               </div>
            ),
         },
         {
            key: 'actions',
            name: 'Actions',
            width: 120,
            formatter: ({ row }) => <TableActions row={row} handleEdit={handleEdit} handleDelete={handleDelete} />,
         },
      ],
      []
   )

   useEffect(() => {
      if (!isModalOpen) {
         setSelectedRow(null)
      }
   }, [isModalOpen])

   useEffect(() => {
      ;(async () => {
         setStatus('LOADING')

         const _filters = [...filters.keys()].map(key => {
            const values = filters.get(key)
            return { column: key, operator: 'in', values }
         })

         const { error = null, data = [] } = await get({
            table: 'transactions',
            columns: '*',
            filters: _filters,
         })

         if (error) {
            setError(error)
            setStatus('ERROR')
         } else {
            if (data.length === 0) {
               setData([])
               setStatus('EMPTY')
            }

            setData(data)
            setStatus('SUCCESS')
         }
      })()
   }, [filters])

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
         <ul className="filters_list">
            {[...filters.entries()].map(([type, value]) => (
               <li key={type} className="filters_item">
                  <span className="filter__column">{type}</span>
                  <span className="filter__operator">one of</span>
                  <span className="filter__value">{value.join(', ')}</span>
               </li>
            ))}
         </ul>
         <Renderer status={status} error={error}>
            <main>
               <DataGrid rows={data} rowHeight={28} columns={columns} />
            </main>
         </Renderer>
         <CreateTransactionForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} data={selectedRow} />
      </>
   )
}

const TableActions = ({ row, handleEdit, handleDelete }) => {
   return (
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
