import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useForm } from '@mantine/form'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { TextInput, NumberInput, SegmentedControl, Select, Stack, Button, LoadingOverlay, Box } from '@mantine/core'

import { transaction, upsertTransaction } from '@/queries'
import type { Account, Category, Group, PaymentMethod, TransactionRow, TransactionType } from '@/types'

type TransactionModalProps = {
   close: () => void
   entities: Array<{ title: string; list: Account[] | PaymentMethod[] | Category[] | Group[] }>
}

const INITIAL_STATE = {
   title: '',
   amount: 0,
   type: 'expense' as TransactionType,
   date: dayjs(new Date()).toDate(),
   category_id: null,
   payment_method_id: null,
   account_id: null,
   group_id: null,
}

export const TransactionModal: FC<TransactionModalProps> = ({ close, entities = [] }) => {
   const router = useRouter()
   const queryClient = useQueryClient()

   const operation = router.query.id ? 'UPDATE' : 'INSERT'

   const { data: { data = {}, error = null } = {}, isLoading } = useQuery({
      queryKey: ['transaction', router.query.id],
      queryFn: () => transaction({ id: router.query.id as string }),
   })

   const form = useForm<TransactionRow>({
      initialValues: INITIAL_STATE,
      validate: {
         title: value => (!!(value ?? '').trim() ? null : 'Title is required'),
         amount: value => (/^\d+(\.\d{1,2})?$/.test(value.toString()) ? null : 'Enter a valid amount'),
      },
   })

   useEffect(() => {
      if (error || !data) return form.setValues(INITIAL_STATE)
      if (!data?.id) return form.setValues(INITIAL_STATE)

      form.setValues({
         id: data.id,
         title: data.title,
         group_id: data.group_id,
         amount: data.amount / 100,
         date: new Date(data.date),
         account_id: data.account_id,
         category_id: data.category_id,
         type: data.type as TransactionType,
         payment_method_id: data.payment_method_id,
      })
   }, [data, error])

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

   const upsertTransactionMutation = useMutation({
      mutationFn: (values: TransactionRow) => upsertTransaction(values),
      onSettled: () => {
         notifications.show({
            color: 'green',
            message: `Succesfully ${operation === 'UPDATE' ? 'updated' : 'added'} the transaction`,
         })
         queryClient.invalidateQueries({ queryKey: ['transactions'] })
         router.push('/')
         close()
      },
   })

   const onSubmit = async (values: TransactionRow) => {
      await upsertTransactionMutation.mutate(values)
   }

   return (
      <Box maw={400} pos="relative">
         <LoadingOverlay visible={isLoading} overlayBlur={2} />
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
                  searchable
                  label="Category"
                  data={categories}
                  placeholder="Select a category"
                  {...form.getInputProps('category_id')}
               />
               <Select
                  clearable
                  searchable
                  label="Payment Method"
                  data={paymentMethods}
                  placeholder="Select a payment method"
                  {...form.getInputProps('payment_method_id')}
               />
               <Select
                  clearable
                  searchable
                  label="Account"
                  data={accounts}
                  placeholder="Select an account"
                  {...form.getInputProps('account_id')}
               />
               <Select
                  clearable
                  searchable
                  label="Groups"
                  data={groups}
                  placeholder="Select a group"
                  {...form.getInputProps('group_id')}
               />
               <Button type="submit" variant="light">
                  {operation === 'UPDATE' ? 'Update' : 'Save'}
               </Button>
            </Stack>
         </form>
      </Box>
   )
}
