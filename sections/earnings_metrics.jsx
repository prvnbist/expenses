import { useQuery } from '@apollo/react-hooks'

import { TOTAL_EARNINGS } from '../queries'
import { formatCurrency } from '../utils'

import { Table } from '../components'

export const EarningsMetrics = () => {
   const { data, loading } = useQuery(TOTAL_EARNINGS)

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
               <Table.Cell as="td">Earnings Count</Table.Cell>
               <Table.Cell as="td" align="right">
                  {data?.total_earnings.aggregate.count}
               </Table.Cell>
            </Table.Row>
            <Table.Row isEven={true}>
               <Table.Cell as="td">Average Earning</Table.Cell>
               <Table.Cell as="td" align="right">
                  {formatCurrency(
                     data?.total_earnings.aggregate.avg.amount.toFixed(2)
                  )}
               </Table.Cell>
            </Table.Row>
            <Table.Row>
               <Table.Cell as="td">Maximum Earning</Table.Cell>
               <Table.Cell as="td" align="right">
                  {formatCurrency(
                     data?.total_earnings.aggregate.max.amount.toFixed(2)
                  )}
               </Table.Cell>
            </Table.Row>
            <Table.Row isEven={true}>
               <Table.Cell as="td">Minimum Earning</Table.Cell>
               <Table.Cell as="td" align="right">
                  {formatCurrency(
                     data?.total_earnings.aggregate.min.amount.toFixed(2)
                  )}
               </Table.Cell>
            </Table.Row>
         </Table.Body>
      </Table>
   )
}
