import { useSubscription } from '@apollo/react-hooks'

import { TOTAL_EARNINGS } from '../../../graphql'
import { formatCurrency } from '../../../utils'

import { Table } from '../../../components'

export const Analytics = () => {
   const [metrics, setMetrics] = React.useState({
      count: 0,
      avg: 0,
      max: 0,
      min: 0,
   })
   const { data: { total_earnings = {} } = {}, loading } = useSubscription(
      TOTAL_EARNINGS
   )
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
      if ('aggregate' in total_earnings) {
         setMetrics({
            count: total_earnings.aggregate.count,
            avg: total_earnings.aggregate.avg.amount || 0,
            max: total_earnings.aggregate.max.amount || 0,
            min: total_earnings.aggregate.min.amount || 0,
         })
      }
   }, [total_earnings])

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
                  <Table.Cell as="td">Earnings Count</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {metrics.count}
                  </Table.Cell>
               </Table.Row>
               <Table.Row isEven={true}>
                  <Table.Cell as="td">Average Earning</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {formatCurrency(metrics.avg.toFixed(2))}
                  </Table.Cell>
               </Table.Row>
               <Table.Row>
                  <Table.Cell as="td">Maximum Earning</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {formatCurrency(metrics.max.toFixed(2))}
                  </Table.Cell>
               </Table.Row>
               <Table.Row isEven={true}>
                  <Table.Cell as="td">Minimum Earning</Table.Cell>
                  <Table.Cell as="td" align="right">
                     {formatCurrency(metrics.min.toFixed(2))}
                  </Table.Cell>
               </Table.Row>
            </Table.Body>
         )}
      </Table>
   )
}
