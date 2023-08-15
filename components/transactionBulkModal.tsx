import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { IconCheck, IconTrash } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import {
   ActionIcon,
   Button,
   Group as GroupUI,
   Modal,
   NumberInput,
   ScrollArea,
   SegmentedControl,
   Select,
   Space,
   Table,
   TextInput,
} from '@mantine/core'

import { useMap } from '@/hooks'
import { useGlobalState } from '@/state'
import { addTransactions } from '@/queries'
import type { Entities, TransactionRow, TransactionType } from '@/types'

import UploadModal from './uploadModal'

const INITIAL_FORM_STATE = {
   title: '',
   amount: 0,
   type: 'expense' as TransactionType,
   date: dayjs(new Date()).toDate(),
   category_id: null,
   payment_method_id: null,
   account_id: null,
   group_id: null,
}

export const TransactionBulkModal = ({ close }: { close: () => void }) => {
   const queryClient = useQueryClient()
   const { entities } = useGlobalState()

   const [openedUploadModal, { open: openUploadModal, close: closeUploadModal }] = useDisclosure(false)

   const [rows, handlers] = useMap<string, TransactionRow>([[uuidv4(), INITIAL_FORM_STATE]])

   const addTransactionsMutation = useMutation({
      mutationFn: (items: TransactionRow[]) => addTransactions(items),
      onSettled: () => {
         handlers.setAll([[uuidv4(), INITIAL_FORM_STATE]])
         notifications.show({
            color: 'green',
            message: 'Succesfully added the transactions',
         })
         queryClient.invalidateQueries({ queryKey: ['transactions'] })
         close()
      },
   })

   const onRowSave = (values: TransactionRow, id: string) => {
      handlers.set(id, values)
   }

   return (
      <>
         <GroupUI>
            <Button
               variant="light"
               color="grape"
               size="xs"
               onClick={() => {
                  handlers.set(uuidv4(), INITIAL_FORM_STATE)
               }}
            >
               Add a row
            </Button>
            <Button
               variant="light"
               color="green"
               size="xs"
               onClick={() => addTransactionsMutation.mutate([...rows.entries()].map(([_, row]) => row))}
            >
               Save
            </Button>
            <Button size="xs" color="blue" variant="light" onClick={openUploadModal}>
               Import
            </Button>
            <Button
               variant="subtle"
               color="gray"
               size="xs"
               onClick={() => {
                  handlers.setAll([[uuidv4(), INITIAL_FORM_STATE]])
               }}
            >
               Reset
            </Button>
         </GroupUI>
         <Space h={13} />
         <ScrollArea offsetScrollbars>
            <Table withBorder withColumnBorders striped>
               <thead>
                  <tr>
                     <th>Title</th>
                     <th>Amount</th>
                     <th>Date</th>
                     <th>Type</th>
                     <th>Category</th>
                     <th>Payment Method</th>
                     <th>Account</th>
                     <th className="text-center">Action</th>
                  </tr>
               </thead>
               <tbody>
                  {[...rows.entries()].map(([id, row]) => (
                     <Row
                        key={id}
                        data={row}
                        entities={entities}
                        onSave={data => onRowSave(data, id)}
                        onRemove={() => handlers.remove(id)}
                     />
                  ))}
               </tbody>
            </Table>
         </ScrollArea>
         <Modal
            opened={openedUploadModal}
            onClose={closeUploadModal}
            title="Upload CSV"
            zIndex={1001}
            overlayProps={{
               zIndex: 1000,
               opacity: 0.55,
               blur: 3,
            }}
         >
            <UploadModal
               onUpload={data => {
                  handlers.setAll(data.map(datum => [uuidv4(), datum]))
                  closeUploadModal()
               }}
            />
         </Modal>
      </>
   )
}

const Row = ({
   data,
   onSave,
   onRemove,
   entities,
}: {
   entities: Entities
   data: TransactionRow
   onRemove: () => void
   onSave: (values: TransactionRow) => void
}) => {
   const form = useForm<TransactionRow>({
      initialValues: data,
      validate: {
         title: value => (!!(value ?? '').trim() ? null : ' '),
         amount: value => (/^\d+(\.\d{1,2})?$/.test(value.toString()) ? null : ' '),
      },
   })

   return (
      <tr>
         <td style={{ minWidth: '180px' }}>
            <TextInput
               placeholder="Enter the title"
               size="xs"
               withAsterisk
               variant="unstyled"
               {...form.getInputProps('title')}
            />
         </td>
         <td style={{ minWidth: '140px' }}>
            <NumberInput
               size="xs"
               hideControls
               precision={2}
               withAsterisk
               variant="unstyled"
               placeholder="Enter the amount"
               {...form.getInputProps('amount')}
            />
         </td>
         <td>
            <DatePickerInput
               size="xs"
               variant="unstyled"
               placeholder="Select date"
               maxDate={dayjs(new Date()).toDate()}
               popoverProps={{ position: 'bottom', withinPortal: true }}
               {...form.getInputProps('date')}
            />
         </td>
         <td>
            <SegmentedControl
               size="xs"
               fullWidth
               data={[
                  { label: 'Expense', value: 'expense' },
                  { label: 'Income', value: 'income' },
               ]}
               {...form.getInputProps('type')}
            />
         </td>
         <td style={{ minWidth: '160px' }}>
            <Select
               size="xs"
               clearable
               searchable
               withinPortal
               variant="unstyled"
               data={entities.categories}
               placeholder="Select a category"
               {...form.getInputProps('category_id')}
            />
         </td>
         <td style={{ minWidth: '160px' }}>
            <Select
               size="xs"
               clearable
               searchable
               withinPortal
               variant="unstyled"
               data={entities.payment_methods}
               placeholder="Select a payment method"
               {...form.getInputProps('payment_method_id')}
            />
         </td>
         <td style={{ minWidth: '160px' }}>
            <Select
               size="xs"
               clearable
               searchable
               withinPortal
               data={entities.accounts}
               variant="unstyled"
               placeholder="Select an account"
               {...form.getInputProps('account_id')}
            />
         </td>
         <td style={{ minWidth: '80px' }}>
            <GroupUI spacing="sm" w="100%">
               <ActionIcon
                  size="xs"
                  color="green"
                  variant="subtle"
                  onClick={() => {
                     const { hasErrors } = form.validate()
                     if (!hasErrors) {
                        onSave(form.values)
                     }
                  }}
               >
                  <IconCheck size={16} />
               </ActionIcon>
               <ActionIcon size="xs" color="red" variant="subtle" onClick={onRemove}>
                  <IconTrash size={16} />
               </ActionIcon>
            </GroupUI>
         </td>
      </tr>
   )
}
