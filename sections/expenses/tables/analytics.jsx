import tw from 'twin.macro'

import { Table } from '../../../components'
import { useConfig } from '../../../context'
import { TOTAL_EXPENSES } from '../../../graphql'

export const Analytics = ({ loading, total_expenses }) => {
   const { methods } = useConfig()
   const [metrics, setMetrics] = React.useState({
      count: 0,
      avg: 0,
      max: 0,
      min: 0,
      sum: 0,
   })
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

   React.useEffect(() => {
      if ('aggregate' in total_expenses) {
         setMetrics({
            count: total_expenses.aggregate.count,
            avg: total_expenses.aggregate.avg.amount || 0,
            max: total_expenses.aggregate.max.amount || 0,
            min: total_expenses.aggregate.min.amount || 0,
            sum: total_expenses.aggregate.sum.amount || 0,
         })
      }
   }, [total_expenses])

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
               {[false, true, false, true].map((node, index) => (
                  <Table.Row isEven={node} key={index}>
                     <Table.Cell as="td" />
                     <Table.Cell as="td" />
                  </Table.Row>
               ))}
            </Table.Body>
         ) : (
            <Table.Body>
               <Table.Row>
                  <Table.Cell as="td">Expenses Count</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {metrics.count}
                  </Table.Cell>
               </Table.Row>
               <Table.Row isEven={true}>
                  <Table.Cell as="td">Average Spending</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {methods.format_currency(metrics.avg.toFixed(2))}
                  </Table.Cell>
               </Table.Row>
               <Table.Row>
                  <Table.Cell as="td">Maximum Spending</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {methods.format_currency(metrics.max.toFixed(2))}
                  </Table.Cell>
               </Table.Row>
               <Table.Row isEven={true}>
                  <Table.Cell as="td">Minimum Spending</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {methods.format_currency(metrics.min.toFixed(2))}
                  </Table.Cell>
               </Table.Row>
               <Table.Row>
                  <Table.Cell as="td">Total</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {methods.format_currency(metrics.sum.toFixed(2))}
                  </Table.Cell>
               </Table.Row>
            </Table.Body>
         )}
      </Table>
   )
}
