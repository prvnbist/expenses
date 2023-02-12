import Dinero from 'dinero.js'
import { useMemo } from 'react'
import supabase from '~/lib/supabase'
import DataGrid from 'react-data-grid'
import { json, redirect } from '@remix-run/node'
import { IconEdit, IconPlus } from '@tabler/icons-react'
import { Order, Search, CreateTransaction } from '~/components'
import { useLoaderData, useSearchParams } from '@remix-run/react'

export async function loader({ request }) {
   try {
      // Parse Params
      const params = [...new URL(request.url).searchParams.entries()]
      const queryParams = {
         sort: [],
         search: '',
         transactionId: null,
      }
      for (let [key, value] of params) {
         if (key === 'sort') {
            const items = value.split(',')
            items.forEach(item => {
               if (item.includes('.')) {
                  const [column, direction] = item.split('.')
                  queryParams[key].push({ column, direction })
               }
            })
         } else if (key === 'search') {
            queryParams[key] = value.trim()
         } else if (key === 'id') {
            queryParams['transactionId'] = value
         }
      }

      // Fetch transactions
      const query = supabase.from('transactions').select('*').range(0, 9)

      if (queryParams.search.trim()) {
         query.ilike('title', `%${queryParams.search.trim()}%`)
      }

      if (queryParams.sort.length > 0) {
         queryParams.sort.forEach(item => {
            const { column, direction } = item
            query.order(column, { ascending: direction === 'asc' })
         })
      }

      const { status, data = [] } = await query

      // Fetch categories, payment methods, accounts and groups
      const response = await supabase.rpc('entities')

      const entities = response.data.reduce((acc, curr) => {
         acc[curr.title] = curr.list
         return acc
      }, {})

      // Fetch transaction if id exists
      let transaction = null
      if (queryParams.transactionId) {
         const response = await supabase.from('transactions').select('*').eq('id', queryParams.transactionId).single()
         if (!response.error) {
            transaction = response.data
         }
      }

      return json({ status: 200, data, query: queryParams, entities, transaction: transaction })
   } catch (error) {
      console.log(error)
      return json({ status: 500 })
   }
}

export async function action({ request }) {
   const raw = await request.formData()
   const parsed = Object.fromEntries(raw)
   const errors = {}

   if (!parsed.title.trim()) {
      errors['title'] = 'Please enter a title'
   }
   if (!parsed.amount.trim()) {
      errors['amount'] = 'Please enter a amount'
   } else if (isNaN(Number(parsed.amount))) {
      errors['amount'] = 'Please enter a valid amount'
   }
   if (!parsed.date.trim()) {
      errors['date'] = 'Please select a date'
   }

   parsed.amount = Number(parsed.amount).toFixed(2) * 100

   if (!parsed.payment_method_id) {
      parsed.payment_method_id = null
   }
   if (!parsed.category_id) {
      parsed.category_id = null
   }
   if (!parsed.account_id) {
      parsed.account_id = null
   }
   if (!parsed.group_id) {
      parsed.group_id = null
   }

   if (!parsed.id) {
      delete parsed.id
   }

   if (Object.keys(errors).length > 0) {
      return json({ status: 'INCOMPLETE', data: parsed, errors })
   }

   const { error } = await supabase.from('transaction').upsert(parsed)
   if (error) {
      return json({ status: 'ERROR', data: parsed })
   }

   const params = new URL(request.url).searchParams
   params.delete('create')
   params.delete('id')
   return redirect(`/?${params.toString()}`)
}

export default function Home() {
   const [params, setParams] = useSearchParams()
   const { status, query, data } = useLoaderData()
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
         { key: 'type', name: 'Type' },
         {
            key: 'actions',
            name: 'Actions',
            width: 120,
            headerCellClass: 'text-center',
            formatter: ({ row }) => (
               <TableActions
                  row={row}
                  handleEdit={() => {
                     params.set('create', true)
                     params.set('id', row.id)
                     setParams(params)
                  }}
               />
            ),
         },
      ],
      []
   )

   if (status === 500) return <span>Something went wrong!</span>
   return (
      <div>
         <h2 className="heading2">Transactions</h2>
         <div className="spacer-md" />
         <div className="h-stack">
            <button
               className="btn btn-outline btn-icon"
               onClick={() => {
                  params.set('create', true)
                  setParams(params)
               }}
            >
               <IconPlus color="white" size={16} />
            </button>
            <Order data={query?.sort || []} columns={columns.map(({ key, name }) => ({ key, name }))} />
            <Search />
         </div>
         <div className="spacer-sm" />
         <DataGrid rows={data} rowHeight={28} columns={columns} />
         {params.get('create') === 'true' && <CreateTransaction />}
      </div>
   )
}

const TableActions = ({ row, handleEdit }) => {
   return (
      <div className="table__actions">
         <button title="Edit" onClick={handleEdit} className="btn btn-ghost btn-icon btn-xs">
            <IconEdit size={14} />
         </button>
      </div>
   )
}
