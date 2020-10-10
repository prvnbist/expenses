import tw from 'twin.macro'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import {
   CREATE_EXPENSE,
   UPDATE_EXPENSE,
   CREATE_EARNING,
   UPDATE_EARNING,
   PAYMENT_METHODS,
   EARNING_SOURCES,
   EXPENSES_CATEGORIES,
} from '../graphql'

import { useForm } from '../context'
import { Field, Label, Input, Select } from '../components'

export const Form = () => {
   const { state, dispatch } = useForm()
   const { data: { payment_methods = [] } = {} } = useSubscription(
      PAYMENT_METHODS
   )
   const { data: { expense_categories = [] } = {} } = useSubscription(
      EXPENSES_CATEGORIES
   )

   const { data: { earning_sources = [] } = {} } = useSubscription(
      EARNING_SOURCES
   )

   return (
      <div tw="fixed inset-0 bg-tint sm:pt-40 flex items-start justify-center">
         <div tw="w-full h-full bg-white sm:w-11/12 sm:h-auto lg:w-7/12 xl:w-4/12  p-5 rounded-lg">
            <div tw="flex">
               <div tw="flex-1 rounded-lg border mr-3">
                  <button
                     onClick={() =>
                        dispatch({
                           type: 'TOGGLE_FORM',
                           payload: { type: 'EXPENSE' },
                        })
                     }
                     css={[
                        tw`inline-block h-10 focus:outline-none rounded-lg focus:bg-indigo-200 focus:text-indigo-800 py-2 px-3`,
                        state.form.type === 'EXPENSE'
                           ? tw`bg-indigo-200 text-indigo-800`
                           : '',
                     ]}
                  >
                     Expense
                  </button>
                  <button
                     onClick={() =>
                        dispatch({
                           type: 'TOGGLE_FORM',
                           payload: { type: 'EARNING' },
                        })
                     }
                     css={[
                        tw`inline-block h-10 focus:outline-none rounded-lg focus:bg-indigo-200 focus:text-indigo-800 py-2 px-3`,
                        state.form.type === 'EARNING'
                           ? tw`bg-indigo-200 text-indigo-800`
                           : '',
                     ]}
                  >
                     Earning
                  </button>
               </div>
               <button
                  onClick={() =>
                     dispatch({
                        type: 'TOGGLE_FORM',
                        payload: {
                           isOpen: false,
                           mode: 'CREATE',
                           type: 'EXPENSE',
                           data: {},
                        },
                     })
                  }
                  tw="text-2xl flex-shrink-0 rounded-lg w-10 h-10 border hover:bg-gray-300"
               >
                  &times;
               </button>
            </div>
            {state.form.type === 'EXPENSE' && (
               <ExpenseForm
                  methods={payment_methods}
                  categories={expense_categories}
               />
            )}
            {state.form.type === 'EARNING' && (
               <EarningForm sources={earning_sources} />
            )}
         </div>
      </div>
   )
}

const ExpenseForm = ({ methods, categories }) => {
   const { state, dispatch } = useForm()
   const [create] = useMutation(CREATE_EXPENSE)
   const [update] = useMutation(UPDATE_EXPENSE)

   const handleSubmit = e => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      if (state.form.mode === 'CREATE') {
         create({
            variables: {
               ...data,
               date: new Date(data.date).toISOString(),
            },
         })
      } else if (state.form.mode === 'EDIT') {
         const { id, __typename, ...rest } = state.form.data
         update({
            variables: {
               id: state.form.data.id,
               _set: {
                  ...rest,
                  ...data,
               },
            },
         })
      }
      dispatch({
         type: 'TOGGLE_FORM',
         payload: { isOpen: false, mode: 'CREATE', type: 'EXPENSE', data: {} },
      })
   }

   return (
      <div>
         <h1 tw="text-xl mt-4 mb-3 text-teal-600">Create Expense</h1>
         <form onSubmit={handleSubmit}>
            <div tw="flex">
               <Field>
                  <Label htmlFor="title">Title</Label>
                  <Input
                     type="text"
                     name="title"
                     placeholder="Enter title"
                     defaultValue={state.form.data?.title || ''}
                  />
               </Field>
            </div>

            <div tw="flex">
               <Field>
                  <Label htmlFor="category">Categories</Label>
                  <Select
                     id="category"
                     name="category"
                     value={state.form.data?.category}
                     list={categories.map(category => category.title)}
                  />
               </Field>
               <Field>
                  <Label htmlFor="date">Date</Label>
                  <Input
                     type="date"
                     name="date"
                     defaultValue={
                        state.form.data?.date?.substr(0, 10) ||
                        new Date().toISOString().substr(0, 10)
                     }
                  />
               </Field>
            </div>
            <div tw="flex">
               <Field>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                     type="number"
                     name="amount"
                     placeholder="Enter amount"
                     defaultValue={state.form.data?.amount || 0}
                  />
               </Field>
               <Field>
                  <Label htmlFor="payment_method">Payment Options</Label>
                  <Select
                     id="payment_method"
                     name="payment_method"
                     list={methods.map(method => method.title)}
                     value={state.form.data?.payment_method}
                  />
               </Field>
            </div>
            <button
               type="submit"
               tw="h-10 w-auto px-3 bg-teal-500 text-white rounded"
            >
               {state.form.mode === 'CREATE' ? 'Create' : 'Update'} Expense
            </button>
         </form>
      </div>
   )
}

const EarningForm = ({ sources }) => {
   const { state, dispatch } = useForm()
   const [create] = useMutation(CREATE_EARNING)
   const [update] = useMutation(UPDATE_EARNING)

   const handleSubmit = e => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      if (state.form.mode === 'CREATE') {
         create({
            variables: {
               ...data,
               date: new Date(data.date).toISOString(),
            },
         })
      } else if (state.form.mode === 'EDIT') {
         const { id, __typename, ...rest } = state.form.data
         update({
            variables: {
               id: state.form.data.id,
               _set: {
                  ...rest,
                  ...data,
               },
            },
         })
      }
      dispatch({
         type: 'TOGGLE_FORM',
         payload: { isOpen: false, mode: 'CREATE', type: 'EXPENSE', data: {} },
      })
   }
   return (
      <div>
         <h1 tw="text-xl mt-4 mb-3 text-teal-600">Create Earning</h1>
         <form onSubmit={handleSubmit}>
            <div tw="flex">
               <Field>
                  <Label htmlFor="source">Source</Label>
                  <Input
                     type="text"
                     name="source"
                     placeholder="Enter source"
                     defaultValue={state.form.data?.source}
                  />
               </Field>
               <Field>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                     type="number"
                     name="amount"
                     placeholder="Enter amount"
                     defaultValue={state.form.data?.amount || 0}
                  />
               </Field>
            </div>

            <div tw="flex">
               <Field>
                  <Label htmlFor="category">Categories</Label>
                  <Select
                     id="category"
                     name="category"
                     value={state.form.data?.category}
                     list={sources.map(source => source.title)}
                  />
               </Field>
               <Field>
                  <Label htmlFor="date">Date</Label>
                  <Input
                     type="date"
                     name="date"
                     defaultValue={
                        state.form.data?.date?.substr(0, 10) ||
                        new Date().toISOString().substr(0, 10)
                     }
                  />
               </Field>
            </div>
            <button
               type="submit"
               tw="h-10 w-auto px-3 bg-teal-500 text-white rounded"
            >
               {state.form.mode === 'CREATE' ? 'Create' : 'Update'} Earning
            </button>
         </form>
      </div>
   )
}
