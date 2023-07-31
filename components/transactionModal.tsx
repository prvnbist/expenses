import dayjs from 'dayjs'
import { FC, useMemo } from 'react'
import { useForm } from '@mantine/form'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TextInput, NumberInput, SegmentedControl, Select, Stack, Button } from '@mantine/core'

import { addTransaction } from '@/queries'

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

type TransactionModalProps = {
   close: () => void
   entities: Array<{ title: string; list: Account[] | PaymentMethod[] | Category[] | Group[] }>
}

export type TransactionRow = {
   title: string
   amount: number
   date: Date
   type: 'expense' | 'income'
   account_id: string | null
   category_id: string | null
   payment_method_id: string | null
   group_id: string | null
}

export const TransactionModal: FC<TransactionModalProps> = ({ close, entities = [] }) => {
   const queryClient = useQueryClient()

   const form = useForm<TransactionRow>({
      initialValues: {
         title: '',
         amount: 0,
         type: 'expense',
         date: dayjs(new Date()).toDate(),
         category_id: null,
         payment_method_id: null,
         account_id: null,
         group_id: null,
      },
      validate: {
         title: value => (!!(value ?? '').trim() ? null : 'Title is required'),
         amount: value => (/^\d+(\.\d{1,2})?$/.test(value.toString()) ? null : 'Enter a valid amount'),
      },
   })

   const { categories, accounts, paymentMethods, groups } = useMemo(() => {
      const categoriesList = entities.find(entity => entity.title === 'categories')?.list ?? []
      const paymentMethodsList = entities.find(entity => entity.title === 'payment_methods')?.list ?? []
      const accountsList = entities.find(entity => entity.title === 'accounts')?.list ?? []
      const groupsList = entities.find(entity => entity.title === 'groups')?.list ?? []

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
         groups: groupsList.map(item => ({
            value: item.id,
            label: item.title,
         })),
      }
   }, [entities])

   const addTransactionMutation = useMutation({
      mutationFn: (values: TransactionRow) => addTransaction(values),
      onSettled: () => {
         notifications.show({
            color: 'green',
            message: 'Succesfully added the transaction',
         })
         queryClient.invalidateQueries({ queryKey: ['transactions'] })
         close()
      },
   })

   const onSubmit = async (values: TransactionRow) => {
      await addTransactionMutation.mutate(values)
   }

   return (
      <form onSubmit={form.onSubmit(onSubmit)}>
         <Stack>
            <TextInput placeholder="Enter the title" label="Title" withAsterisk {...form.getInputProps('title')} />
            <NumberInput
               hideControls
               precision={2}
               placeholder="Enter the amount"
               label="Amount"
               withAsterisk
               {...form.getInputProps('amount')}
            />
            <DatePickerInput
               label="Date"
               placeholder="Select date"
               maxDate={dayjs(new Date()).toDate()}
               popoverProps={{ position: 'bottom', withinPortal: true }}
               {...form.getInputProps('date')}
            />
            <SegmentedControl
               data={[
                  { label: 'Expense', value: 'expense' },
                  { label: 'Income', value: 'income' },
               ]}
               {...form.getInputProps('type')}
            />
            <Select
               clearable
               label="Category"
               data={categories}
               placeholder="Select a category"
               {...form.getInputProps('category_id')}
            />
            <Select
               clearable
               label="Payment Method"
               data={paymentMethods}
               placeholder="Select a payment method"
               {...form.getInputProps('payment_method_id')}
            />
            <Select
               clearable
               label="Account"
               data={accounts}
               placeholder="Select an account"
               {...form.getInputProps('account_id')}
            />
            <Select
               clearable
               label="Groups"
               data={groups}
               placeholder="Select a group"
               {...form.getInputProps('group_id')}
            />
            <Button type="submit" variant="light">
               Save
            </Button>
         </Stack>
      </form>
   )
}
