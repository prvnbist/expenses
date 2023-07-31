import { ScrollArea, Table as UITable } from '@mantine/core'

import { Entity } from '@/types'

type FormatterValueArg = string | number | null
export interface IColumn<T> {
   label: string
   key: keyof T
   className: string
   formatter: (value: FormatterValueArg, row: T) => string | JSX.Element
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
                                 {column.key === 'actions' && column.formatter(value as FormatterValueArg, item)}
                                 {column.key !== 'actions' &&
                                    (column.formatter ? column.formatter(value as FormatterValueArg, item) : value)}
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
