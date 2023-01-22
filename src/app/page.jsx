'use client'
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
   const { status, error, data } = useQuery({
      table: 'transactions',
      columns: `*`,
      order: [
         { key: 'date', direction: 'desc' },
         { key: 'title', direction: 'asc' },
      ],
   })
   return (
      <>
         <Renderer status={status} error={error}>
            <main>
               <DataGrid columns={columns} rows={data} rowHeight={28} />
            </main>
         </Renderer>
         <CreateTransactionForm />
      </>
   )
}
