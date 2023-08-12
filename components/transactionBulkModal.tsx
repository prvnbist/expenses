import dayjs from 'dayjs'
import Papa from 'papaparse'
import { v4 as uuidv4 } from 'uuid'
import { FC, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IconCheck, IconTrash, IconUpload } from '@tabler/icons-react'

import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import {
   ActionIcon,
   Button,
   FileInput,
   Group,
   Modal,
   NumberInput,
   SegmentedControl,
   Select,
   Space,
   Table,
   TextInput,
} from '@mantine/core'

import { useMap } from '@/hooks'
import { addTransactions } from '@/queries'

type Account = {
   id: string
   title: string
   type: never
}

type PaymentMethod = {
   id: string
   title: string
   type: never
}

type Category = {
   id: string
   title: string
   type: 'expense' | 'income'
}

type Group = {
   id: string
   title: string
   type: never
}

type TransactionBulkModalProps = {
   close: () => void
   entities: Array<{ title: string; list: Account[] | PaymentMethod[] | Category[] | Group[] }>
}

type TransactionType = 'expense' | 'income'

type TransactionRow = {
   title: string
   amount: number
   date: Date
   type: TransactionType
   account_id: string | null
   category_id: string | null
   payment_method_id: string | null
   group_id: string | null
}

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

type Entities = {
   accounts: Array<{ value: string; label: string }>
   categories: Array<{ value: string; label: string; group: string }>
   paymentMethods: Array<{ value: string; label: string }>
}

const transformCSV = (csv: any, entities: Entities): TransactionRow[] => {
   const data = csv.data

   return data.map((datum: any) => {
      datum.amount = datum.type === 'income' ? datum.credit : datum.debit
      datum.amount = parseFloat(datum.amount.replace('₹', '').replace(/,/g, ''))

      datum.date = new Date(datum.date)

      datum.category_id =
         entities.categories.find(category => {
            return category.label === datum.category && category.group === datum.type
         })?.value || null

      datum.payment_method_id =
         entities.paymentMethods.find(payment_method => {
            return payment_method.label === datum.payment_method
         })?.value || null

      datum.account_id = entities.accounts.find(account => account.label === datum.account)?.value || null

      datum.note = datum.note || null

      delete datum.credit
      delete datum.debit
      delete datum.category
      delete datum.payment_method
      delete datum.account

      return datum
   })
}

const UploadModal = ({ entities, onUpload }: { onUpload: (data: TransactionRow[]) => void; entities: Entities }) => {
   const [file, setFile] = useState<File | null>(null)

   const upload = () => {
      if (file) {
         const reader = new FileReader()

         reader.onloadend = ({ target }) => {
            if (target && target.result) {
               // @ts-ignore
               const csv = Papa.parse(target.result, { header: true })
               const data = transformCSV(csv, entities)

               onUpload(data)
            }
         }

         reader.readAsText(file)
      }
   }
   return (
      <div>
         <FileInput
            placeholder="Select csv file"
            radius="md"
            withAsterisk
            accept="text/csv"
            value={file}
            onChange={setFile}
         />
         <Space h={16} />
         <Button color="green" radius="md" fullWidth leftIcon={<IconUpload size={16} />} onClick={upload}>
            Upload
         </Button>
      </div>
   )
}

export const TransactionBulkModal: FC<TransactionBulkModalProps> = ({ close, entities = [] }) => {
   const queryClient = useQueryClient()
   const [openedUploadModal, { open: openUploadModal, close: closeUploadModal }] = useDisclosure(false)

   const [rows, handlers] = useMap<string, TransactionRow>([[uuidv4(), INITIAL_FORM_STATE]])

   const { categories, accounts, paymentMethods } = useMemo(() => {
      const categoriesList = entities.find(entity => entity.title === 'categories')?.list ?? []
      const paymentMethodsList = entities.find(entity => entity.title === 'payment_methods')?.list ?? []
      const accountsList = entities.find(entity => entity.title === 'accounts')?.list ?? []

      return {
         categories: categoriesList.map(item => ({
            value: item.id,
            label: item.title,
            group: item.type,
         })),
         paymentMethods: paymentMethodsList.map(item => ({
            value: item.id,
            label: item.title,
         })),
         accounts: accountsList.map(item => ({
            value: item.id,
            label: item.title,
         })),
      }
   }, [entities])

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
         <Group>
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
         </Group>
         <Space h={13} />
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
                     {...{ categories, accounts, paymentMethods }}
                     onSave={data => onRowSave(data, id)}
                     onRemove={() => handlers.remove(id)}
                  />
               ))}
            </tbody>
         </Table>
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
               entities={{ categories, accounts, paymentMethods }}
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
   accounts,
   categories,
   paymentMethods,
}: {
   data: TransactionRow
   onRemove: () => void
   accounts: Entities['accounts']
   categories: Entities['categories']
   onSave: (values: TransactionRow) => void
   paymentMethods: Entities['paymentMethods']
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
         <td>
            <TextInput
               placeholder="Enter the title"
               size="xs"
               withAsterisk
               variant="unstyled"
               {...form.getInputProps('title')}
            />
         </td>
         <td width="140px">
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
         <td>
            <Select
               size="xs"
               clearable
               withinPortal
               variant="unstyled"
               data={categories}
               placeholder="Select a category"
               {...form.getInputProps('category_id')}
            />
         </td>
         <td>
            <Select
               size="xs"
               clearable
               withinPortal
               variant="unstyled"
               data={paymentMethods}
               placeholder="Select a payment method"
               {...form.getInputProps('payment_method_id')}
            />
         </td>
         <td>
            <Select
               size="xs"
               clearable
               withinPortal
               data={accounts}
               variant="unstyled"
               placeholder="Select an account"
               {...form.getInputProps('account_id')}
            />
         </td>
         <td width="80px">
            <Group spacing="sm" w="100%">
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
            </Group>
         </td>
      </tr>
   )
}
