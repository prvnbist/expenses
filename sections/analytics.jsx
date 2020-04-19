import groupBy from 'lodash.groupby'
import { useQuery } from '@apollo/react-hooks'

import { EXPENSES } from '../queries'

import { formatCurrency } from '../utils'

export const Analytics = () => {
   const [categories, setCategories] = React.useState([])
   const { loading, error, data: { expenses = [] } = {} } = useQuery(EXPENSES)
   React.useEffect(() => {
      const groups = groupBy(expenses, 'category')
      const categories = []
      for (let [key, value] of Object.entries(groups)) {
         const amount = value.reduce((acc, current) => acc + current.amount, 0)
         categories.push({ title: key, expenses: value.length, amount })
      }
      setCategories(categories.sort((a, b) => b.amount - a.amount))
   }, [expenses])

   const columns = [
      {
         key: 'Category',
         type: 'String',
      },
      {
         key: 'Total Amount',
         type: 'Number',
      },
      {
         key: 'Expenses Count',
         type: 'Number',
      },
   ]

   return (
      <div>
         <h1 className="mt-4 text-2xl">Analytics</h1>
         <div className="w-6/12">
            <h2 className="border-b pb-2 text-lg mt-3 mb-2 text-teal-700">
               Spendings by categories
            </h2>
            <table className="w-full table-auto">
               <thead>
                  <tr>
                     {columns.map((column, index) => (
                        <th
                           key={index}
                           className={`px-4 py-2 uppercase text-gray-600 font-medium text-sm tracking-wider ${
                              column.type === 'String'
                                 ? 'text-left'
                                 : 'text-right'
                           }`}
                        >
                           {column.key}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {categories.map((category, index) => (
                     <tr
                        key={index}
                        className={`${(index & 1) === 1 ? 'bg-gray-100' : ''}`}
                     >
                        <td className="border px-4 py-2">{category.title}</td>
                        <td className="border px-4 py-2 text-right">
                           {formatCurrency(category.amount)}
                        </td>
                        <td className="border px-4 py-2 text-right">
                           {category.expenses}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}
