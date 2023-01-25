'use client'
import { useQuery } from '@/hooks'
import { Renderer } from '@/components'
import DataGrid from 'react-data-grid'

const columns = [{ key: 'title', name: 'Title' }]

export default function Home() {
   const { status, error, data } = useQuery({
      table: 'account',
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