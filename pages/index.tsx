import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useListState, useDisclosure } from '@mantine/hooks'
import {
   Modal,
   ActionIcon,
   Center,
   Container,
   Flex,
   Pagination,
   Space,
   Title,
   ScrollArea,
   Text,
   Button,
} from '@mantine/core'

import { useIsMounted } from '@/hooks'
import type { Transaction } from '@/types'
import { IColumn, SortButton, Table, TransactionBulkModal, TransactionModal } from '@/components'
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
   const router = useRouter()
   const queryClient = useQueryClient()
   const [opened, { open, close }] = useDisclosure(false)
   const [openedBulkModal, { open: openBulkModal, close: closeBulkModal }] = useDisclosure(false)

   const isMounted = useIsMounted()

   useEffect(() => {
      if (isMounted()) {
         const id = router.query?.id
         if (id) open()
      }
   }, [isMounted, router.query])

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

   const { data: { data: entities = {} } = {}, isLoading: isEntitiesLoading } = useQuery({
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

   const confirmDeleteDialog = useCallback(
      (id: string) =>
         modals.openConfirmModal({
            title: 'Delete Transaction',
            children: <Text size="sm">Are you sure you want to delete this transaction</Text>,
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: () => deleteTransactionMutation.mutate(id),
         }),
      []
   )

   const actionColumn = useMemo(
      () =>
         ({
            key: 'actions',
            label: 'Actions',
            className: 'text-center',
            formatter: (_, row) => (
               <Center>
                  <ActionIcon
                     color="blue"
                     size="sm"
                     onClick={() => {
                        router.push(`/?id=${row.public_id}`)
                     }}
                  >
                     <IconPencil size={14} />
                  </ActionIcon>
                  <ActionIcon color="red" size="sm" onClick={() => confirmDeleteDialog(row.id)}>
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
            <Button
               size="xs"
               leftIcon={<IconPlus size={18} />}
               color="yellow"
               radius="md"
               variant="subtle"
               onClick={openBulkModal}
            >
               Bulk Insert
            </Button>
         </Flex>
         <Space h="md" />
         <SortButton {...{ sorts, handlers, columns: [...columns, actionColumn] }} />
         <Space h="sm" />
         <Table<Transaction> loading={isLoading} columns={[...columns, actionColumn]} data={data?.data ?? []} />
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
         {!isEntitiesLoading && (
            <>
               <Modal
                  opened={opened}
                  onClose={() => {
                     router.push('/')
                     close()
                  }}
                  scrollAreaComponent={ScrollArea.Autosize}
                  title={`${router.query?.id ? 'Update' : 'Add'} Transaction`}
               >
                  <TransactionModal entities={entities} close={close} />
               </Modal>
               <Modal
                  fullScreen
                  withinPortal
                  title="Add Transaction"
                  opened={openedBulkModal}
                  onClose={() => closeBulkModal()}
               >
                  <TransactionBulkModal entities={entities} close={closeBulkModal} />
               </Modal>
            </>
         )}
      </Container>
   )
}
