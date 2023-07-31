import { useMemo, useState } from 'react'
import { UseListStateHandlers } from '@mantine/hooks'
import { IconArrowsSort, IconCheck, IconSortAscending, IconSortDescending, IconX } from '@tabler/icons-react'
import { ActionIcon, Button, Flex, HoverCard, SegmentedControl, Select, Stack, Center } from '@mantine/core'

import { Sort } from '@/queries'
import { Transaction } from '@/types'
import { IColumn } from '@/components'

const SORT_OPTIONS = [
   {
      label: (
         <Center>
            <IconSortAscending size="1rem" />
         </Center>
      ),
      value: 'ASC',
   },
   {
      label: (
         <Center>
            <IconSortDescending size="1rem" />
         </Center>
      ),
      value: 'DESC',
   },
]

export const SortButton = ({
   sorts,
   handlers,
   columns,
}: {
   sorts: Sort[]
   handlers: UseListStateHandlers<Sort>
   columns: IColumn<Transaction>[]
}) => {
   const [newSort, setNewSort] = useState<Sort>({ value: '', direction: 'ASC' })

   const sortColumns = useMemo(() => {
      return columns.reduce((list: IColumn<Transaction>[], column: IColumn<Transaction>) => {
         const index = sorts.findIndex(sort => sort.value === column.key)
         if (index === -1) list.push(column)
         return list
      }, [])
   }, [columns, sorts])

   return (
      <HoverCard shadow="md" position="bottom-start">
         <HoverCard.Target>
            <Button size="xs" variant="light" color="gray" leftIcon={<IconArrowsSort size={16} />}>
               Sort
            </Button>
         </HoverCard.Target>
         <HoverCard.Dropdown>
            <Stack>
               {sorts.map((sort, index) => (
                  <Flex align="center" gap="sm" key={sort.value}>
                     <Select
                        disabled
                        searchable
                        size="xs"
                        value={sort.value}
                        placeholder="Select column"
                        data={columns.map(column => ({ value: column.key, label: column.label }))}
                     />
                     <SegmentedControl
                        size="xs"
                        data={SORT_OPTIONS}
                        value={sort.direction === 'ASC' ? 'ASC' : 'DESC'}
                        onChange={value =>
                           handlers.setItem(index, { value: sort.value, direction: value as Sort['direction'] })
                        }
                     />
                     <ActionIcon color="red" variant="light" onClick={() => handlers.remove(index)}>
                        <IconX size={16} />
                     </ActionIcon>
                  </Flex>
               ))}
               <Flex align="center" gap="sm">
                  <Select
                     searchable
                     size="xs"
                     value={newSort.value}
                     placeholder="Select column"
                     onChange={value => setNewSort(prev => ({ ...prev, value: value || '' }))}
                     data={sortColumns.map(column => ({ value: column.key, label: column.label }))}
                  />
                  <SegmentedControl
                     size="xs"
                     data={SORT_OPTIONS}
                     value={newSort.direction === 'ASC' ? 'ASC' : 'DESC'}
                     onChange={value => setNewSort(prev => ({ ...prev, direction: value } as Sort))}
                  />
                  <ActionIcon
                     color="green"
                     variant="light"
                     disabled={!newSort.value}
                     onClick={() => {
                        handlers.append(newSort)
                        setNewSort({ value: '', direction: 'ASC' })
                     }}
                  >
                     <IconCheck size={16} />
                  </ActionIcon>
               </Flex>
            </Stack>
         </HoverCard.Dropdown>
      </HoverCard>
   )
}
