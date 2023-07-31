import dayjs from 'dayjs'
import { useState, useMemo, useCallback } from 'react'
import { useListState, useDisclosure } from '@mantine/hooks'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Modal, ActionIcon, Center, Container, Flex, Loader, Pagination, Space, Title, ScrollArea } from '@mantine/core'

import { Transaction } from '@/types'
import { IColumn, SortButton, Table, TransactionModal } from '@/components'
import { Sort, allEntities, deleteTransaction, transactions, transactionsTotal } from '@/queries'

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
] as IColumn<Transaction>[]

export default function Home() {
   const queryClient = useQueryClient()
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

   const deleteTransactionMutation = useMutation({
      mutationFn: (id: string) => deleteTransaction(id),
      onSettled: () => {
         notifications.show({
            message: 'Succesfully deleted the transaction',
         })
         queryClient.invalidateQueries({ queryKey: ['transactions'] })
      },
   })

   const handleDelete = useCallback(
      async (id: string) => {
         deleteTransactionMutation.mutate(id)
      },
      [deleteTransactionMutation]
   )

   const actionColumn = useMemo(
      () =>
         ({
            key: 'actions',
            label: 'Actions',
            className: 'text-center',
            formatter: (_, row) => (
               <Center>
                  <ActionIcon color="red" size="sm" onClick={() => handleDelete(row.id)}>
                     <IconTrash size={14} />
                  </ActionIcon>
               </Center>
            ),
         } as IColumn<Transaction>),
      []
   )

   return (
      <Container fluid py="md">
         <Flex align="center" gap="md">
            <Title order={3}>Transactions</Title>
            <ActionIcon color="yellow" radius="md" variant="light" onClick={open}>
               <IconPlus size={18} />
            </ActionIcon>
         </Flex>
         <Space h="md" />
         <SortButton {...{ sorts, handlers, columns: [...columns, actionColumn] }} />
         <Space h="sm" />
         {isLoading ? (
            <Center>
               <Loader color="lime" size="sm" />
            </Center>
         ) : (
            <Table<Transaction> columns={[...columns, actionColumn]} data={data?.data ?? []} />
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
