import groupBy from 'lodash.groupby'

import { Table } from '../../components'
import { useConfig } from '../../context'

export const ByCategories = ({ loading, expenses }) => {
   const { methods } = useConfig()
   const [categories, setCategories] = React.useState([])
   const [columns] = React.useState([
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
   ])

   React.useEffect(() => {
      const groups = groupBy(expenses, 'category')
      const categories = []
      for (let [key, value] of Object.entries(groups)) {
         const amount = value.reduce((acc, current) => acc + current.amount, 0)
         categories.push({ title: key, expenses: value.length, amount })
      }
      setCategories(categories.sort((a, b) => b.amount - a.amount))
   }, [expenses])

   return (
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
         {loading ? (
            <Table.Body>
               {[false, true, false, true, false].map((node, index) => (
                  <Table.Row isEven={node} key={index}>
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                  </Table.Row>
               ))}
            </Table.Body>
         ) : (
            <Table.Body>
               {categories.length > 0 ? (
                  categories.map((category, index) => (
                     <Table.Row key={index} isEven={(index & 1) === 1}>
                        <Table.Cell as="td">{category.title}</Table.Cell>
                        <Table.Cell as="td" align="right">
                           <span className="font-medium text-red-600">
                              - {methods.format_currency(category.amount)}
                           </span>
                        </Table.Cell>
                        <Table.Cell as="td" align="right">
                           {category.expenses}
                        </Table.Cell>
                     </Table.Row>
                  ))
               ) : (
                  <h3 className="text-center my-3">No data</h3>
               )}
            </Table.Body>
         )}
      </Table>
   )
}
