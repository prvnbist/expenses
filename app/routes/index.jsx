import Dinero from 'dinero.js'
import { useMemo } from 'react'
import supabase from '~/lib/supabase'
import { json } from '@remix-run/node'
import DataGrid from 'react-data-grid'
import { useLoaderData } from '@remix-run/react'

export async function loader({ request }) {
   try {
      const params = new URL(request.url).searchParams

      const query = supabase.from('transactions').select('*').range(0, 9)

      if (params.get('sort')) {
         const items = params.get('sort').split(',')

         items.forEach(item => {
            if (item.includes('.')) {
               const [column, direction] = item.split('.')
               query.order(column, { ascending: direction === 'asc' })
            }
         })
      }
      const { status, data = [] } = await query
      return json({ status, data })
   } catch (error) {
      return json({ status: 500 })
   }
}

export default function Home() {
   const { status, data } = useLoaderData()
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
         <DataGrid rows={data} rowHeight={28} columns={columns} />
      </div>
   )
}
