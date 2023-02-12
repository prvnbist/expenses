import Dinero from 'dinero.js'
import { useMemo } from 'react'
import supabase from '~/lib/supabase'
import DataGrid from 'react-data-grid'
import { IconPlus } from '@tabler/icons-react'
import { json, redirect } from '@remix-run/node'
import { Order, Search, CreateTransaction } from '~/components'
import { useLoaderData, useSearchParams } from '@remix-run/react'

export async function loader({ request }) {
   try {
      const params = [...new URL(request.url).searchParams.entries()]
      const queryParams = {
         sort: [],
         search: '',
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
         }
      }

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

      const response = await supabase.rpc('entities')

      const entities = response.data.reduce((acc, curr) => {
         acc[curr.title] = curr.list
         return acc
      }, {})
      return json({ status: 200, data, query: queryParams, entities })
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

   if (Object.keys(errors).length > 0) {
      return json({ status: 'INCOMPLETE', data: parsed, errors })
   }

   const { error } = await supabase.from('transaction').upsert(parsed)
   if (error) {
      return json({ status: 'ERROR', data: parsed })
   }

   const params = new URL(request.url).searchParams
   params.delete('create')
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
