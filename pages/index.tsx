import dayjs from 'dayjs'
import { useState } from 'react'
import { modals } from '@mantine/modals'
import { useListState, useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Modal, ActionIcon, Center, Container, Flex, Loader, Pagination, Space, Title, ScrollArea } from '@mantine/core'

import { Transaction } from '@/types'
import { IColumn, SortButton, Table, TransactionModal } from '@/components'
import { Sort, allEntities, transactions, transactionsTotal } from '@/queries'

const columns = [
   { key: 'title', label: 'Title' },
   {
      key: 'amount',
      label: 'Amount',
      className: 'text-right',
      formatter: (value: number) =>
         (value / 100).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
         }),
   },
   {
      key: 'date',
      label: 'Date',
      className: 'text-right',
      formatter: (value: string) => dayjs(value).locale('en').format('MMM D, YYYY'),
   },
   { key: 'category', label: 'Category' },
   { key: 'payment_method', label: 'Payment Method' },
   { key: 'account', label: 'Account' },
   { key: 'group', label: 'Group' },
   { key: 'note', label: 'Note' },
] as IColumn<Transaction>[]

export default function Home() {
   const [opened, { open, close }] = useDisclosure(false)

   const [sorts, handlers] = useListState<Sort>([
      { value: 'date', direction: 'DESC' },
      { value: 'title', direction: 'ASC' },
   ])

   const [page, setPage] = useState(1)

   const { data, isLoading } = useQuery({
      queryKey: ['transactions', sorts, page],
      queryFn: () => transactions({ sorts, page }),
   })

   const { data: { count = 0 } = {} } = useQuery({
      queryKey: ['transactionsTotal'],
      queryFn: transactionsTotal,
   })

   const { data: { data: entities = {} } = {} } = useQuery({
      queryKey: ['entities'],
      queryFn: allEntities,
   })

   return (
      <Container fluid py="md">
         <Flex align="center" gap="md">
            <Title order={3}>Transactions</Title>
            <ActionIcon color="yellow" radius="md" variant="light" onClick={open}>
               <IconPlus size={18} />
            </ActionIcon>
         </Flex>
         <Space h="md" />
         <SortButton {...{ sorts, handlers, columns }} />
         <Space h="sm" />
         {isLoading ? (
            <Center>
               <Loader color="lime" size="sm" />
            </Center>
         ) : (
            <Table<Transaction> columns={columns} data={data?.data ?? []} />
         )}
         <Space h="sm" />
         <Center>
            <Pagination
               color="gray"
               onChange={setPage}
               radius="md"
               siblings={2}
               size="sm"
               total={(count ?? 0) / 10}
               value={page}
               withEdges
            />
         </Center>
         <Modal opened={opened} onClose={close} title="Add Transaction" scrollAreaComponent={ScrollArea.Autosize}>
            <TransactionModal entities={entities} close={close} />
         </Modal>
      </Container>
   )
}
