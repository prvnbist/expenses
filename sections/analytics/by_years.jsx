import groupBy from 'lodash.groupby'

import { formatDate } from '../../utils'

import { Table } from '../../components'
import { useConfig } from '../../context'

export const ByYears = ({ loading, expenses }) => {
   const { methods } = useConfig()
   const [years, setYears] = React.useState([])
   const [columns] = React.useState([
      {
         key: 'Year',
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
      const formatted = expenses.map(expense => ({
         ...expense,
         date: new Date(formatDate(expense.date)).getFullYear(),
      }))

      const groups = groupBy(formatted, 'date')
      const years = []
      for (let [key, value] of Object.entries(groups)) {
         const amount = value.reduce((acc, current) => acc + current.amount, 0)
         years.push({ year: key, expenses: value.length, amount })
      }
      setYears(years.sort((a, b) => b.year - a.year))
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
               {years.length > 0 ? (
                  years.map((category, index) => (
                     <Table.Row key={index} isEven={(index & 1) === 1}>
                        <Table.Cell as="td">{category.year}</Table.Cell>
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
