import React from 'react'
import tw, { styled } from 'twin.macro'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useSubscription } from '@apollo/client'

import {
   ACCOUNTS,
   CATEGORIES,
   INSERT_TRANSACTION,
   PAYMENT_METHODS,
} from '../../graphql'
import * as Icon from '../../assets/icons'
import { useTransactions } from '../../hooks'
import { Button, Select } from '../../components'

const Styles = {
   Fieldset: styled.fieldset`
      ${tw`flex flex-col space-y-1 mt-3 flex-1`}
   `,
   Label: styled.label`
      ${tw`text-xs text-gray-500 uppercase font-medium tracking-wider`}
   `,
   Text: styled.input`
      ${tw`text-sm bg-dark-200 h-10 rounded px-2`}
   `,
}

export const Form = () => {
   const { addToast } = useToasts()
   const { remove, editForm, setIsFormOpen, setEditForm } = useTransactions()

   const [form, setForm] = React.useState({
      title: '',
      amount: '',
      account_id: '',
      type: 'expense',
      category_id: '',
      payment_method_id: '',
      date: new Date().toISOString().slice(0, 10),
   })
   const [upsert, { loading }] = useMutation(INSERT_TRANSACTION, {
      onCompleted: () => {
         setEditForm({})
         setIsFormOpen(false)
         const isNew = Object.keys(editForm || {}).length > 0
         addToast(
            `Successfully ${isNew ? 'updated' : 'created'} a new transaction.`,
            { appearance: 'success' }
         )
      },
      onError: error => {
         addToast('Failed to create a new transaction.', {
            appearance: 'error',
         })
         console.log('insert -> error -> ', error)
      },
   })
   const { data: { categories = [] } = {} } = useSubscription(CATEGORIES)
   const { data: { accounts = [] } = {} } = useSubscription(ACCOUNTS)
   const { data: { payment_methods = [] } = {} } =
      useSubscription(PAYMENT_METHODS)

   React.useEffect(() => {
      if (Object.keys(editForm).length > 0) {
         const {
            __typename,
            account,
            payment_method,
            category,
            date,
            raw_date,
            ...rest
         } = editForm
         setForm(existing => ({
            ...existing,
            ...rest,
            date: raw_date.slice(0, 10),
         }))
      }
   }, [editForm])

   const isFormValid =
      form.title &&
      form.amount > 0 &&
      form.type &&
      form.date &&
      form.category_id &&
      form.account_id

   const handleSubmit = () => {
      if (!isFormValid) return

      const { debit, credit, payment_method_id, ...rest } = form
      upsert({
         variables: {
            object: {
               ...rest,
               amount: Number(form.amount),
               date: new Date(form.date).toISOString(),
               ...(form.type === 'expense' && { payment_method_id }),
            },
            update_columns: [
               'date',
               'type',
               'title',
               'amount',
               'account_id',
               'category_id',
               'payment_method_id',
            ],
         },
      })
   }

   const handleChange = (name, value) => {
      setForm(existing => ({ ...existing, [name]: value }))
   }

   const resetForm = () => {
      setForm({
         title: '',
         amount: '',
         account_id: '',
         type: 'expense',
         category_id: '',
         payment_method_id: '',
         date: new Date().toISOString().slice(0, 10),
      })
   }
   return (
      <section>
         <header tw="pl-3 pr-2 flex items-center justify-between h-12 border-b border-dark-200">
            <h3>{editForm?.id ? 'Update' : 'Add'} Details</h3>
            <Button.Icon
               is_small
               onClick={() => {
                  resetForm()
                  setEditForm({})
                  setIsFormOpen(false)
               }}
            >
               <Icon.Close tw="stroke-current" />
            </Button.Icon>
         </header>
         <main tw="p-2">
            <Styles.Fieldset>
               <Styles.Label htmlFor="title">Title</Styles.Label>
               <Styles.Text
                  id="title"
                  type="text"
                  name="title"
                  value={form.title}
                  placeholder="Enter the title"
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Styles.Fieldset>
            <Styles.Fieldset>
               <Styles.Label htmlFor="amount">Amount</Styles.Label>
               <Styles.Text
                  type="text"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  placeholder="Enter the amount"
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Styles.Fieldset>
            <Styles.Fieldset>
               <Styles.Label htmlFor="date">Date</Styles.Label>
               <Styles.Text
                  type="date"
                  id="date"
                  name="date"
                  value={form.date}
                  placeholder="Select the date"
                  onChange={e => handleChange(e.target.name, e.target.value)}
               />
            </Styles.Fieldset>
            <Styles.Fieldset>
               <Styles.Label htmlFor="type">Type</Styles.Label>
               <section tw="bg-dark-200 px-1 h-10 flex items-center rounded">
                  <button
                     css={[
                        tw`text-sm px-2 h-8 flex-1 rounded`,
                        form.type === 'expense' && tw`bg-dark-300`,
                     ]}
                     onClick={() => handleChange('type', 'expense')}
                  >
                     Expense
                  </button>
                  <button
                     css={[
                        tw`text-sm px-2 h-8 flex-1 rounded`,
                        form.type === 'income' && tw`bg-dark-300`,
                     ]}
                     onClick={() => handleChange('type', 'income')}
                  >
                     Income
                  </button>
               </section>
            </Styles.Fieldset>
            <Styles.Fieldset>
               <Styles.Label htmlFor="category">Category</Styles.Label>
               <Select
                  is_small
                  placeholder="Search categories"
                  on_deselect={() => handleChange('category_id', null)}
                  on_select={option => handleChange('category_id', option.id)}
                  selected={categories.find(
                     category => category.id === form.category_id
                  )}
               >
                  {categories
                     .filter(node => node.type === form.type)
                     .map(option => (
                        <Select.Option key={option.id} option={option} />
                     ))}
               </Select>
            </Styles.Fieldset>
            {form.type === 'expense' && (
               <Styles.Fieldset>
                  <Styles.Label htmlFor="payment_method">
                     Payment Method
                  </Styles.Label>
                  <Select
                     is_small
                     placeholder="Search payment method"
                     on_deselect={() => handleChange('payment_method_id', null)}
                     on_select={option =>
                        handleChange('payment_method_id', option.id)
                     }
                     selected={payment_methods.find(
                        payment_method =>
                           payment_method.id === form.payment_method_id
                     )}
                  >
                     {payment_methods.map(option => (
                        <Select.Option key={option.id} option={option} />
                     ))}
                  </Select>
               </Styles.Fieldset>
            )}
            <Styles.Fieldset>
               <Styles.Label htmlFor="account">Account</Styles.Label>
               <Select
                  is_small
                  placeholder="Search accounts"
                  on_deselect={() => handleChange('account_id', null)}
                  on_select={option => handleChange('account_id', option.id)}
                  selected={accounts.find(
                     account => account.id === form.account_id
                  )}
               >
                  {accounts.map(option => (
                     <Select.Option key={option.id} option={option} />
                  ))}
               </Select>
            </Styles.Fieldset>
            <div tw="h-4" />
            <footer tw="flex gap-3">
               <Button.Text
                  is_loading={loading}
                  onClick={handleSubmit}
                  is_disabled={!isFormValid}
               >
                  Submit
               </Button.Text>
               {editForm?.id && (
                  <Button.Icon
                     variant="danger"
                     onClick={async () => {
                        await remove({ variables: { id: editForm.id } })
                        resetForm()
                     }}
                  >
                     <Icon.Delete tw="stroke-current" />
                  </Button.Icon>
               )}
            </footer>
         </main>
      </section>
   )
}
