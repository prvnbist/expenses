import groupBy from 'lodash.groupby'

import { formatCurrency } from '../../utils'

import { Table } from '../../components'

const months = [
   'January',
   'February',
   'March',
   'April',
   'May',
   'June',
   'July',
   'August',
   'September',
   'October',
   'November',
   'December',
]

export const ByMonths = ({ expenses }) => {
   const [list, setList] = React.useState([])
   const [columns] = React.useState([
      {
         key: 'Months',
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
         date: new Date(expense.date).getMonth(),
      }))

      const groups = groupBy(formatted, 'date')
      const result = []
      for (let [key, value] of Object.entries(groups)) {
         const amount = value.reduce((acc, current) => acc + current.amount, 0)
         result.push({ month: key, expenses: value.length, amount })
      }
      setList(result)
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
            {list.map((category, index) => (
               <Table.Row key={index} isEven={(index & 1) === 1}>
                  <Table.Cell as="td">{months[category.month]}</Table.Cell>
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
