import { Tab } from '../components'
import { useMutation } from '@apollo/react-hooks'

import { CREATE_EXPENSE } from '../queries'

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
               <fieldset className="fmb-4 mr-4" style={{ flex: '70%' }}>
                  <label
                     htmlFor="title"
                     className="uppercase text-gray-500 tracking-wider"
                  >
                     Title
                  </label>
                  <input
                     type="text"
                     name="title"
                     placeholder="Enter title"
                     className="w-full mt-2 mr-3  border rounded h-12 px-3"
                  />
               </fieldset>
               <fieldset className="mb-4">
                  <label
                     htmlFor="amount"
                     className="uppercase text-gray-500 tracking-wider"
                  >
                     Title
                  </label>
                  <input
                     type="number"
                     name="amount"
                     placeholder="Enter amount"
                     className="w-full mt-2 mr-3  border rounded h-12 px-3"
                  />
               </fieldset>
            </div>

            <div className="flex">
               <fieldset className="flex flex-col flex-1 mr-4">
                  <label
                     htmlFor="category"
                     className="uppercase text-gray-500 tracking-wider"
                  >
                     Categories
                  </label>
                  <select
                     name="category"
                     id="category"
                     className="w-full mt-2 border rounded h-12 px-3"
                  >
                     {categories.map((category, index) => (
                        <option key={index} value={category}>
                           {category}
                        </option>
                     ))}
                  </select>
               </fieldset>
               <fieldset className="flex flex-col flex-1">
                  <label
                     htmlFor="date"
                     className="uppercase text-gray-500 tracking-wider"
                  >
                     Date
                  </label>
                  <input
                     type="date"
                     name="date"
                     className="w-full mt-2 mr-3 mb-6 border rounded h-12 px-3"
                  />
               </fieldset>
            </div>
            <fieldset className="flex flex-col">
               <label
                  htmlFor="payment_method"
                  className="uppercase text-gray-500 tracking-wider"
               >
                  Payment Options
               </label>
               <select
                  name="payment_method"
                  id="payment_method"
                  className="w-full mt-2 border rounded h-12 px-3"
               >
                  {paymentOptions.map((category, index) => (
                     <option key={index} value={category}>
                        {category}
                     </option>
                  ))}
               </select>
            </fieldset>
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

export const Form = ({ setIsFormVisible }) => {
   const [tab, setTab] = React.useState('expense')
   return (
      <div className="fixed inset-0 bg-tint pt-40 flex items-start justify-center">
         <div className="bg-white w-5/12 p-5 rounded-lg">
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
            {tab === 'earning' && <div>Create Earning</div>}
         </div>
      </div>
   )
}
