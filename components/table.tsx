import { ScrollArea, Skeleton, Table as UITable } from '@mantine/core'

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
   loading: boolean
}

const Loader = () => (
   <UITable striped withBorder>
      <thead>
         <tr>
            {[1, 2, 3, 4, 5].map(item => (
               <th key={item}>
                  <Skeleton height={8} width={`${Math.floor(Math.random() * 80) + 20}%`} radius="xl" />
               </th>
            ))}
         </tr>
      </thead>
      <tbody>
         {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <tr key={i}>
               {[1, 2, 3, 4, 5].map(j => (
                  <td key={j}>
                     <Skeleton height={8} width={`${Math.floor(Math.random() * 80) + 20}%`} radius="xl" />
                  </td>
               ))}
            </tr>
         ))}
      </tbody>
   </UITable>
)

export const Table = <T extends Entity>({ loading, columns = [], data = [] }: TableProps<T>) => {
   if (loading) return <Loader />
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
