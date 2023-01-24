'use client'
import supabase from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'

const inputCSS = `w-full max-w-[320px] bg-[var(--dark-300)] border border-[var(--dark-200)] text-sm rounded-lg p-2 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500`

export const CreateTransactionForm = ({ isModalOpen, setIsModalOpen }) => {
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

   if (status === 'LOADING') return null
   return (
      <Modal title="Create Transaction" isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 p-4 overflow-y-auto form-body">
               <fieldset>
                  <Label htmlFor="title" title="Title" />
                  <input
                     type="text"
                     className={inputCSS}
                     {...register('title', { required: true, maxLength: 240, minLength: 1 })}
                  />
               </fieldset>
               <fieldset>
                  <Label htmlFor="date" title="Date" />
                  <input type="date" className={inputCSS} {...register('date', { required: true })} />
               </fieldset>
               <fieldset>
                  <Label htmlFor="amount" title="Amount" />
                  <input
                     type="number"
                     className={inputCSS}
                     step=".01"
                     {...register('amount', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
                  />
               </fieldset>
               <span class="mt-2 text-sm text-[var(--dark-50)]">Eg. 29.99, 1.09 etc.</span>
               <fieldset>
                  <Label htmlFor="type" title="Type" />
                  <select name="type" id="type" className={inputCSS} {...register('type', { required: true })}>
                     <option value="expense">Expense</option>
                     <option value="income">Income</option>
                  </select>
               </fieldset>
               <fieldset>
                  <Label htmlFor="category_id" title="Category" />
                  <select name="category_id" id="category_id" className={inputCSS} {...register('category_id')}>
                     <option value="">Select a category</option>
                     {entities.categories.map(item => (
                        <option value={item.id} key={item.id}>
                           {item.title}
                        </option>
                     ))}
                  </select>
               </fieldset>
               <fieldset>
                  <Label htmlFor="payment_method_id" title="Payment Method" />
                  <select
                     name="payment_method_id"
                     id="payment_method_id"
                     className={inputCSS}
                     {...register('payment_method_id')}
                  >
                     <option value="">Select a payment method</option>
                     {entities.payment_methods.map(item => (
                        <option value={item.id} key={item.id}>
                           {item.title}
                        </option>
                     ))}
                  </select>
               </fieldset>
               <fieldset>
                  <Label htmlFor="account_id" title="Account" />
                  <select name="account_id" id="account_id" className={inputCSS} {...register('account_id')}>
                     <option value="">Select an account</option>
                     {entities.accounts.map(item => (
                        <option value={item.id} key={item.id}>
                           {item.title}
                        </option>
                     ))}
                  </select>
               </fieldset>
               <fieldset>
                  <Label htmlFor="group_id" title="Group" />
                  <select name="group_id" id="group_id" className={inputCSS} {...register('group_id')}>
                     <option value="">Select a group</option>
                     {entities.groups.map(item => (
                        <option value={item.id} key={item.id}>
                           {item.title}
                        </option>
                     ))}
                  </select>
               </fieldset>
            </div>
            <div class="flex items-center p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
               <input
                  type="submit"
                  className="cursor-pointer text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
               />
            </div>
         </form>
      </Modal>
   )
}

const Label = ({ htmlFor, title }) => {
   return (
      <label htmlFor={htmlFor} className="mb-2 text-sm font-medium text-white">
         {title}
      </label>
   )
}

const Modal = ({ title, children, isModalOpen, setIsModalOpen }) => {
   if (!isModalOpen) return null
   return (
      <div
         tabIndex="-1"
         class="flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 z-50 w-full h-full sm:p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
      >
         <div class="relative w-full h-full sm:max-w-[400px]">
            <div class="relative rounded-lg shadow-xl border border-[var(--dark-200)] bg-[var(--dark-300)]">
               <header class="flex items-center justify-between p-4 border-b rounded-t border-[var(--dark-200)]">
                  <h3 class="text-xl font-medium text-white">{title}</h3>
                  <button
                     type="button"
                     onClick={() => setIsModalOpen(false)}
                     class="text-[var(--dark-50)] bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-[var(--dark-200)] hover:text-white"
                  >
                     <svg
                        aria-hidden="true"
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path
                           fillRule="evenodd"
                           d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                           clipRule="evenodd"
                        ></path>
                     </svg>
                     <span class="sr-only">Close modal</span>
                  </button>
               </header>
               <main>{children}</main>
            </div>
         </div>
      </div>
   )
}
