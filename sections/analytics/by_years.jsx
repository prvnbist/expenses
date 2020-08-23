import groupBy from 'lodash.groupby'

import { formatCurrency, formatDate } from '../../utils'

import { Table } from '../../components'

export const ByYears = ({ expenses }) => {
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

   if (expenses.length === 0)
      return <h3 className="text-center my-3">No data</h3>

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
         <Table.Body>
            {years.map((category, index) => (
               <Table.Row key={index} isEven={(index & 1) === 1}>
                  <Table.Cell as="td">{category.year}</Table.Cell>
                  <Table.Cell as="td" align="right">
                     <span className="font-medium text-red-600">
                        - {formatCurrency(category.amount)}
                     </span>
                  </Table.Cell>
                  <Table.Cell as="td" align="right">
                     {category.expenses}
                  </Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}
