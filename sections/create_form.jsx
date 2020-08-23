import { Tab } from '../components'
import { useMutation, useSubscription } from '@apollo/react-hooks'

import {
   CREATE_EXPENSE,
   CREATE_EARNING,
   PAYMENT_METHODS,
   EARNING_SOURCES,
   EXPENSES_CATEGORIES,
} from '../graphql'

import { Field, Label, Input, Select } from '../components'

const ExpenseForm = ({ type = 'create', methods, setIsFormVisible }) => {
   const [createExpense] = useMutation(CREATE_EXPENSE)
   const { data: { expense_categories = [] } = {} } = useSubscription(
      EXPENSES_CATEGORIES
   )

   const handleSubmit = e => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      if (type === 'create') {
         createExpense({
            variables: {
               ...data,
               date: new Date(data.date).toISOString(),
            },
         })
      }
      setIsFormVisible(isFormVisible => !isFormVisible)
   }

   return (
      <div>
         <h1 className="text-xl mt-4 mb-3 text-teal-600">Create Expense</h1>
         <form onSubmit={handleSubmit}>
            <div className="flex">
               <Field>
                  <Label htmlFor="title">Title</Label>
                  <Input type="text" name="title" placeholder="Enter title" />
               </Field>
            </div>

            <div className="flex">
               <Field>
                  <Label htmlFor="category">Categories</Label>
                  <Select
                     id="category"
                     name="category"
                     list={expense_categories.map(category => category.title)}
                  />
               </Field>
               <Field>
                  <Label htmlFor="date">Date</Label>
                  <Input
                     type="date"
                     name="date"
                     defaultValue={new Date().toISOString().substr(0, 10)}
                  />
               </Field>
            </div>
            <div className="flex">
               <Field>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                     type="number"
                     name="amount"
                     placeholder="Enter amount"
                  />
               </Field>
               <Field>
                  <Label htmlFor="payment_method">Payment Options</Label>
                  <Select
                     id="payment_method"
                     name="payment_method"
                     list={methods.map(method => method.title)}
                  />
               </Field>
            </div>
            <button
               type="submit"
               className="h-10 w-auto px-3 bg-teal-500 text-white rounded"
            >
               {type === 'create' ? 'Create' : 'Update'} Expense
            </button>
         </form>
      </div>
   )
}

const EarningForm = ({ type = 'create', setIsFormVisible }) => {
   const [createEarning] = useMutation(CREATE_EARNING)
   const { data: { earning_sources = [] } = {} } = useSubscription(
      EARNING_SOURCES
   )

   const handleSubmit = e => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      if (type === 'create') {
         createEarning({
            variables: {
               ...data,
               date: new Date(data.date).toISOString(),
            },
         })
      }
      setIsFormVisible(isFormVisible => !isFormVisible)
   }
   return (
      <div>
         <h1 className="text-xl mt-4 mb-3 text-teal-600">Create Earning</h1>
         <form onSubmit={handleSubmit}>
            <div className="flex">
               <Field>
                  <Label htmlFor="source">Source</Label>
                  <Input type="text" name="source" placeholder="Enter source" />
               </Field>
               <Field>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                     type="number"
                     name="amount"
                     placeholder="Enter amount"
                  />
               </Field>
            </div>

            <div className="flex">
               <Field>
                  <Label htmlFor="category">Categories</Label>
                  <Select
                     id="category"
                     name="category"
                     list={earning_sources.map(source => source.title)}
                  />
               </Field>
               <Field>
                  <Label htmlFor="date">Date</Label>
                  <Input
                     type="date"
                     name="date"
                     defaultValue={new Date().toISOString().substr(0, 10)}
                  />
               </Field>
            </div>
            <button
               type="submit"
               className="h-10 w-auto px-3 bg-teal-500 text-white rounded"
            >
               {type === 'create' ? 'Create' : 'Update'} Earning
            </button>
         </form>
      </div>
   )
}

export const Form = ({ type = 'create', setIsFormVisible }) => {
   const [tab, setTab] = React.useState('expense')
   const { data: { payment_methods = [] } = {} } = useSubscription(
      PAYMENT_METHODS
   )

   return (
      <div className="fixed inset-0 bg-tint sm:pt-40 flex items-start justify-center">
         <div className="w-full h-full bg-white sm:w-11/12 sm:h-auto lg:w-7/12 xl:w-4/12  p-5 rounded-lg">
            <div className="flex">
               <div className="flex-1 rounded-lg border mr-3">
                  <Tab
                     tab={tab}
                     type="expense"
                     onClick={() => setTab('expense')}
                  >
                     Expense
                  </Tab>
                  <Tab
                     tab={tab}
                     type="earning"
                     onClick={() => setTab('earning')}
                  >
                     Earning
                  </Tab>
               </div>
               <button
                  onClick={() =>
                     setIsFormVisible(isFormVisible => !isFormVisible)
                  }
                  className="text-2xl shrink-0 rounded-lg w-10 h-10 border hover:bg-gray-300"
               >
                  &times;
               </button>
            </div>
            {tab === 'expense' && (
               <ExpenseForm
                  type={type}
                  methods={payment_methods}
                  setIsFormVisible={setIsFormVisible}
               />
            )}
            {tab === 'earning' && (
               <EarningForm type={type} setIsFormVisible={setIsFormVisible} />
            )}
         </div>
      </div>
   )
}
