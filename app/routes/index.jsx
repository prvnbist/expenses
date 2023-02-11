import Dinero from 'dinero.js'
import { useMemo } from 'react'
import supabase from '~/lib/supabase'
import { json } from '@remix-run/node'
import DataGrid from 'react-data-grid'
import { Order, Search } from '~/components'
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
      return json({ status: 200, data, query: queryParams })
   } catch (error) {
      console.log(error)
      return json({ status: 500 })
   }
}

export default function Home() {
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
            <Order data={query?.sort || []} columns={columns.map(({ key, name }) => ({ key, name }))} />
            <Search />
         </div>
         <div className="spacer-sm" />
         <DataGrid rows={data} rowHeight={28} columns={columns} />
      </div>
   )
}
