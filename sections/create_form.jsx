import { Tab } from '../components'
import { useMutation } from '@apollo/react-hooks'

import { CREATE_EXPENSE, CREATE_EARNING } from '../queries'

import { Field, Label, Input, Select } from '../components'

const CreateExpense = () => {
   const [createExpense] = useMutation(CREATE_EXPENSE)
   const [categories] = React.useState([
      'Accessories',
      'Clothing & Footwears',
      'Entertainment',
      'Family',
      'Food & Drinks',
      'Friends',
      'Groceries',
      'Health Care',
      'Internet/Talktime',
      'Others',
      'Rent',
      'Repairs',
      'Stationary',
      'Transportation',
      'Trip',
      'Vehicle',
   ])
   const [paymentOptions] = React.useState([
      'PayTM',
      'GPay',
      'PhonePe',
      'Net Banking',
      'Card',
      'Cash',
   ])

   const handleSubmit = e => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      createExpense({
         variables: {
            ...data,
            date: new Date(data.date).toISOString(),
         },
      })
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
                  <Select id="category" name="category" list={categories} />
               </Field>
               <Field>
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" name="date" />
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
                     list={paymentOptions}
                  />
               </Field>
            </div>
            <button
               type="submit"
               className="h-10 w-auto px-3 bg-teal-500 text-white rounded mt-4"
            >
               Create Expense
            </button>
         </form>
      </div>
   )
}

const CreateEarning = () => {
   const [createEarning] = useMutation(CREATE_EARNING)
   const [categories] = React.useState(['Job', 'Freelance', 'Internship'])

   const handleSubmit = e => {
      e.preventDefault()
      const data = Object.fromEntries(new FormData(e.target))
      createEarning({
         variables: {
            ...data,
            date: new Date(data.date).toISOString(),
         },
      })
   }
   return (
      <div>
         <h1 className="text-xl mt-4 mb-3 text-teal-600">Create Expense</h1>
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
                  <Select id="category" name="category" list={categories} />
               </Field>
               <Field>
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" name="date" />
               </Field>
            </div>
            <button
               type="submit"
               className="h-10 w-auto px-3 bg-teal-500 text-white rounded mt-4"
            >
               Create Earning
            </button>
         </form>
      </div>
   )
}

export const Form = ({ setIsFormVisible }) => {
   const [tab, setTab] = React.useState('expense')
   return (
      <div className="fixed inset-0 bg-tint pt-40 flex items-start justify-center">
         <div className="w-11/12 bg-white lg:w-7/12 xl:w-4/12  p-5 rounded-lg">
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
            {tab === 'expense' && <CreateExpense />}
            {tab === 'earning' && <CreateEarning />}
         </div>
      </div>
   )
}
