import groupBy from 'lodash.groupby'
import { useQuery } from '@apollo/react-hooks'

import { EXPENSES } from '../queries'

import { formatCurrency } from '../utils'

import { Table } from '../components'

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
            <Table>
               <Table.Head>
                  <Table.Row>
                     {columns.map((column, index) => (
                        <Table.Cell as="th" key={index} type={column.type}>
                           {column.key}
                        </Table.Cell>
                     ))}
                  </Table.Row>
               </Table.Head>
               <Table.Body>
                  {categories.map((category, index) => (
                     <Table.Row key={index} isEven={(index & 1) === 1}>
                        <Table.Cell as="td">{category.title}</Table.Cell>
                        <Table.Cell as="td" align="right">
                           {formatCurrency(category.amount)}
                        </Table.Cell>
                        <Table.Cell as="td" align="right">
                           {category.expenses}
                        </Table.Cell>
                     </Table.Row>
                  ))}
               </Table.Body>
            </Table>
         </div>
      </div>
   )
}
