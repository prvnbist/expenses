'use client'
import supabase from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'

export const CreateTransactionForm = () => {
   const {
      reset,
      register,
      handleSubmit,
      formState: { isSubmitSuccessful },
   } = useForm()
   const [entities, setEntities] = useState({
      groups: [],
      accounts: [],
      categories: [],
      payment_methods: [],
   })
   const [status, setStatus] = useState('IDLE')

   useEffect(() => {
      ;(async () => {
         setStatus('LOADING')
         let { data, error } = await supabase.rpc('entities')

         if (error) {
            setStatus('ERROR')
         } else {
            setEntities(
               data.reduce((acc, curr) => {
                  acc[curr.title] = curr.list
                  return acc
               }, {})
            )
            setStatus('SUCCESS')
         }
      })()
   }, [])

   useEffect(() => {
      if (isSubmitSuccessful) {
         reset()
      }
   }, [isSubmitSuccessful, reset])

   const onSubmit = async transaction => {
      transaction.amount = parseFloat(transaction.amount).toFixed(2) * 100

      if (!transaction.payment_method_id) {
         transaction.payment_method_id = null
      }
      if (!transaction.category_id) {
         transaction.category_id = null
      }
      if (!transaction.account_id) {
         transaction.account_id = null
      }
      if (!transaction.group_id) {
         transaction.group_id = null
      }

      await supabase.from('transaction').insert([transaction])
   }

   if (status === 'LOADING') return <span>Loading...</span>
   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <fieldset>
            <label htmlFor="title">Title</label>
            <input type="text" {...register('title', { required: true, maxLength: 240, minLength: 1 })} />
         </fieldset>
         <fieldset>
            <label htmlFor="date">Date</label>
            <input type="date" {...register('date', { required: true })} />
         </fieldset>
         <fieldset>
            <label htmlFor="amount">Amount</label>
            <input type="number" step=".01" {...register('amount', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })} />
         </fieldset>
         <fieldset>
            <label htmlFor="type">Type</label>
            <select name="type" id="type" {...register('type', { required: true })}>
               <option value="expense">Expense</option>
               <option value="income">Income</option>
            </select>
         </fieldset>
         <fieldset>
            <label htmlFor="category_id">Category</label>
            <select name="category_id" id="category_id" {...register('category_id')}>
               <option value="">Select a category</option>
               {entities.categories.map(item => (
                  <option value={item.id} key={item.id}>
                     {item.title}
                  </option>
               ))}
            </select>
         </fieldset>
         <fieldset>
            <label htmlFor="payment_method_id">Payment Method</label>
            <select name="payment_method_id" id="payment_method_id" {...register('payment_method_id')}>
               <option value="">Select a payment method</option>
               {entities.payment_methods.map(item => (
                  <option value={item.id} key={item.id}>
                     {item.title}
                  </option>
               ))}
            </select>
         </fieldset>
         <fieldset>
            <label htmlFor="account_id">Account</label>
            <select name="account_id" id="account_id" {...register('account_id')}>
               <option value="">Select an account</option>
               {entities.accounts.map(item => (
                  <option value={item.id} key={item.id}>
                     {item.title}
                  </option>
               ))}
            </select>
         </fieldset>
         <fieldset>
            <label htmlFor="group_id">Group</label>
            <select name="group_id" id="group_id" {...register('group_id')}>
               <option value="">Select a group</option>
               {entities.groups.map(item => (
                  <option value={item.id} key={item.id}>
                     {item.title}
                  </option>
               ))}
            </select>
         </fieldset>
         <input type="submit" />
      </form>
   )
}
