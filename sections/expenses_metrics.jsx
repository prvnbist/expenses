import { useQuery } from '@apollo/react-hooks'

import { TOTAL_EXPENSES } from '../queries'
import { formatCurrency } from '../utils'

import { Table } from '../components'

export const ExpensesMetrics = () => {
   const { data, loading } = useQuery(TOTAL_EXPENSES)

   const columns = [
      {
         key: 'Title',
         type: 'String',
      },
      {
         key: 'Value',
         type: 'Number',
      },
   ]
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
            <Table.Row>
               <Table.Cell as="td">Expenses Count</Table.Cell>
               <Table.Cell as="td" align="right">
                  {data?.total_expenses.aggregate.count}
               </Table.Cell>
            </Table.Row>
            <Table.Row isEven={true}>
               <Table.Cell as="td">Average Spending</Table.Cell>
               <Table.Cell as="td" align="right">
                  {formatCurrency(
                     data?.total_expenses.aggregate.avg.amount.toFixed(2)
                  )}
               </Table.Cell>
            </Table.Row>
            <Table.Row>
               <Table.Cell as="td">Maximum Spending</Table.Cell>
               <Table.Cell as="td" align="right">
                  {formatCurrency(
                     data?.total_expenses.aggregate.max.amount.toFixed(2)
                  )}
               </Table.Cell>
            </Table.Row>
            <Table.Row isEven={true}>
               <Table.Cell as="td">Minimum Spending</Table.Cell>
               <Table.Cell as="td" align="right">
                  {formatCurrency(
                     data?.total_expenses.aggregate.min.amount.toFixed(2)
                  )}
               </Table.Cell>
            </Table.Row>
         </Table.Body>
      </Table>
   )
}
