import { ScrollArea, Table as UITable } from '@mantine/core'

import { Entity } from '@/types'

export interface IColumn<T> {
   label: string
   key: keyof T
   className: string
   formatter: (value: string | number | null) => string
}

interface TableProps<T> {
   columns: IColumn<T>[]
   data: T[]
}

export const Table = <T extends Entity>({ columns = [], data = [] }: TableProps<T>) => {
   return (
      <ScrollArea.Autosize mah={390}>
         <UITable striped withBorder>
            <thead>
               <tr>
                  {columns.map(column => (
                     <th key={column.key as string} className={column.className ?? ''}>
                        {column.label}
                     </th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {data.map(item => {
                  return (
                     <tr key={item.id}>
                        {columns.map(column => {
                           const value = item[column.key]
                           return (
                              <td key={column.key as string} className={column.className ?? ''}>
                                 {column.formatter ? column.formatter(value) : value}
                              </td>
                           )
                        })}
                     </tr>
                  )
               })}
            </tbody>
         </UITable>
      </ScrollArea.Autosize>
   )
}
