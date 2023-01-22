'use client'
import { useQuery } from '@/hooks'
import { Renderer } from '@/components'
import DataGrid from 'react-data-grid'

const columns = [
   { key: 'title', name: 'Title' },
   { key: 'description', name: 'Description' },
]

export default function Home() {
   const { status, error, data } = useQuery({
      table: 'group',
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
