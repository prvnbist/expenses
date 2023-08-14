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
   Group,
   HoverCard,
   MultiSelect,
} from '@mantine/core'

import { useIsMounted } from '@/hooks'
import type { Account, Category, Entities, PaymentMethod, Transaction } from '@/types'
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

   const [sorts, sortHandlers] = useListState<Sort>([
      { value: 'date', direction: 'DESC' },
      { value: 'title', direction: 'ASC' },
   ])

   const [filterCategories, setFilterCategories] = useState<string[]>([])
   const [filterAccounts, setFilterAccounts] = useState<string[]>([])
   const [filterPaymentMethods, setFilterPaymentMethods] = useState<string[]>([])

   const [page, setPage] = useState(1)

   const { data, isLoading } = useQuery({
      queryKey: ['transactions', sorts, page, filterCategories, filterAccounts, filterPaymentMethods],
      queryFn: () =>
         transactions({
            sorts,
            page,
            categories: filterCategories,
            accounts: filterAccounts,
            paymentMethods: filterPaymentMethods,
         }),
   })

   const { data: { count = 0 } = {} } = useQuery({
      queryKey: ['transactionsTotal', filterCategories, filterAccounts, filterPaymentMethods],
      queryFn: () =>
         transactionsTotal({
            categories: filterCategories,
            accounts: filterAccounts,
            paymentMethods: filterPaymentMethods,
         }),
   })

   const { data: { data: entities } = {}, isLoading: isEntitiesLoading } = useQuery({
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
         <Group>
            <SortButton {...{ sorts, handlers: sortHandlers, columns: [...columns, actionColumn] }} />
            {!isEntitiesLoading && (
               <>
                  <FilterEntityButton
                     label="Category"
                     value={filterCategories}
                     onChange={setFilterCategories}
                     list={entities?.categories ?? []}
                  />
                  <FilterEntityButton
                     label="Account"
                     value={filterAccounts}
                     onChange={setFilterAccounts}
                     list={entities?.accounts ?? []}
                  />
                  <FilterEntityButton
                     label="Payment Method"
                     value={filterPaymentMethods}
                     onChange={setFilterPaymentMethods}
                     list={entities?.payment_methods ?? []}
                  />
               </>
            )}
         </Group>
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
                  <TransactionModal entities={entities as Entities} close={close} />
               </Modal>
               <Modal
                  fullScreen
                  withinPortal
                  title="Add Transaction"
                  opened={openedBulkModal}
                  onClose={() => closeBulkModal()}
               >
                  <TransactionBulkModal entities={entities as Entities} close={closeBulkModal} />
               </Modal>
            </>
         )}
      </Container>
   )
}

const FilterEntityButton = ({
   label,
   value,
   onChange,
   list = [],
}: {
   label: string
   value: string[]
   list: Category[] | Account[] | PaymentMethod[]
   onChange: (values: string[]) => void
}) => {
   console.log(list)
   return (
      <HoverCard shadow="md" position="bottom-start">
         <HoverCard.Target>
            <Button size="xs" variant="light" color="gray" leftIcon={<IconPlus size={16} />}>
               {label} ({value.length})
            </Button>
         </HoverCard.Target>
         <HoverCard.Dropdown>
            <MultiSelect
               maw="320px"
               miw="320px"
               clearable
               data={list}
               value={value}
               onChange={onChange}
               placeholder="Select item"
            />
         </HoverCard.Dropdown>
      </HoverCard>
   )
}
