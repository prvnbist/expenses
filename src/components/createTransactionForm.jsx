'use client'
import supabase from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'

const inputCSS = `w-full max-w-[320px] bg-[var(--dark-300)] border border-[var(--dark-200)] text-sm rounded-lg p-2 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500`

export const CreateTransactionForm = ({ data, isModalOpen, setIsModalOpen }) => {
   const { reset, setValue, register, handleSubmit } = useForm({
      defaultValues: {
         ...(data?.id && {
            type: data?.type,
            date: data?.date,
            title: data?.title,
            group_id: data?.group_id,
            amount: data?.amount / 100,
            account_id: data?.account_id,
            category_id: data?.category_id,
            payment_method_id: data?.payment_method_id,
         }),
      },
   })
   const [entities, setEntities] = useState({
      groups: [],
      accounts: [],
      categories: [],
      payment_methods: [],
   })
   const [status, setStatus] = useState('IDLE')

   useEffect(() => {
      if (data?.id) {
         setValue('type', data?.type)
         setValue('date', data?.date)
         setValue('title', data?.title)
         setValue('group_id', data?.group_id)
         setValue('amount', data?.amount / 100)
         setValue('account_id', data?.account_id)
         setValue('category_id', data?.category_id)
         setValue('payment_method_id', data?.payment_method_id)
      }
   }, [data])

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

   const closePanel = () => {
      reset()
      setIsModalOpen()
   }

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

      if (data?.id) {
         transaction.id = data.id
      }

      await supabase.from('transaction').upsert(transaction)

      closePanel()
   }

   if (status === 'LOADING') return null
   return (
      <Modal closeModal={closePanel} isModalOpen={isModalOpen} title={`${data?.id ? 'Update' : 'Create'} Transaction`}>
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 p-4 overflow-y-auto form-body">
               <Fieldset id="title" title="Title">
                  <input
                     type="text"
                     className={inputCSS}
                     placeholder="Enter the title"
                     {...register('title', { required: true, maxLength: 240, minLength: 1 })}
                  />
               </Fieldset>
               <Fieldset id="date" title="Date">
                  <input
                     type="date"
                     className={inputCSS}
                     placeholder="Enter the date"
                     {...register('date', { required: true })}
                  />
               </Fieldset>
               <Fieldset id="amount" title="Amount">
                  <input
                     step=".01"
                     type="number"
                     className={inputCSS}
                     placeholder="Enter the amount"
                     {...register('amount', { required: true, pattern: /^\d+(\.\d{1,2})?$/ })}
                  />
               </Fieldset>
               <span className="mt-2 text-sm text-[var(--dark-50)]">Eg. 29.99, 1.09 etc.</span>
               <Fieldset id="type" title="Type">
                  <select name="type" id="type" className={inputCSS} {...register('type', { required: true })}>
                     <option value="expense">Expense</option>
                     <option value="income">Income</option>
                  </select>
               </Fieldset>
               <Fieldset id="category_id" title="Category">
                  <select name="category_id" id="category_id" className={inputCSS} {...register('category_id')}>
                     <option value="">Select a category</option>
                     {entities.categories.map(item => (
                        <option value={item.id} key={item.id}>
                           {item.title}
                        </option>
                     ))}
                  </select>
               </Fieldset>
               <Fieldset id="payment_method_id" title="Payment Method">
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
               </Fieldset>
               <Fieldset id="account_id" title="Account">
                  <select name="account_id" id="account_id" className={inputCSS} {...register('account_id')}>
                     <option value="">Select an account</option>
                     {entities.accounts.map(item => (
                        <option value={item.id} key={item.id}>
                           {item.title}
                        </option>
                     ))}
                  </select>
               </Fieldset>
               <Fieldset id="group_id" title="Group">
                  <select name="group_id" id="group_id" className={inputCSS} {...register('group_id')}>
                     <option value="">Select a group</option>
                     {entities.groups.map(item => (
                        <option value={item.id} key={item.id}>
                           {item.title}
                        </option>
                     ))}
                  </select>
               </Fieldset>
            </div>
            <div className="flex items-center p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
               <button
                  title="Cancel"
                  onClick={() => setIsModalOpen(false)}
                  className={`
                     py-2.5 px-5 
                     cursor-pointer 
                     text-sm font-medium text-white 
                     rounded-lg border border-[var(--dark-100)]
                     bg-[var(--dark-300)] hover:bg-[var(--dark-200)]
                     focus:outline-none focus:z-10 focus:ring-4 focus:ring-[var(--dark-50)]
                  `}
               >
                  Cancel
               </button>
               <input
                  type="submit"
                  title="Save"
                  className="cursor-pointer text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
               />
            </div>
         </form>
      </Modal>
   )
}

const Fieldset = ({ id, title, children }) => {
   return (
      <fieldset>
         <Label htmlFor={id} title={title} />
         {children}
      </fieldset>
   )
}

const Label = ({ htmlFor, title }) => {
   return (
      <label htmlFor={htmlFor} className="mb-2 text-sm font-medium text-white">
         {title}
      </label>
   )
}

const Modal = ({ title, children, isModalOpen, closeModal }) => {
   if (!isModalOpen) return null
   return (
      <div
         tabIndex="-1"
         className="flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 z-50 w-full h-full sm:p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
      >
         <div className="relative w-full h-full sm:max-w-[400px]">
            <div className="relative rounded-lg shadow-xl border border-[var(--dark-200)] bg-[var(--dark-300)]">
               <header className="flex items-center justify-between p-4 border-b rounded-t border-[var(--dark-200)]">
                  <h3 className="text-xl font-medium text-white">{title}</h3>
                  <button
                     type="button"
                     onClick={closeModal}
                     className="text-[var(--dark-50)] bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-[var(--dark-200)] hover:text-white"
                  >
                     <svg
                        aria-hidden="true"
                        className="w-5 h-5"
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
                     <span className="sr-only">Close modal</span>
                  </button>
               </header>
               <main>{children}</main>
            </div>
         </div>
      </div>
   )
}
