'use client'
import { useQuery } from '@/hooks'
import { Renderer } from '@/components'
import DataGrid from 'react-data-grid'

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
   })
   return (
      <Renderer status={status} error={error}>
         <main>
            <DataGrid columns={columns} rows={data} rowHeight={28} />
         </main>
      </Renderer>
   )
}
