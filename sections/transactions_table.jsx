import tw from 'twin.macro'
import * as Icon from '../assets/icons'
import { Button, Table, TableLoader } from '../components'

export const TableView = ({
   is_loading,
   transactions,
   methods,
   remove,
   update,
}) => {
   if (is_loading) return <TableLoader />
   return (
      <Table>
         <Table.Head>
            <Table.Row>
               <Table.HCell>Title</Table.HCell>
               <Table.HCell is_right>Credit</Table.HCell>
               <Table.HCell is_right>Debit</Table.HCell>
               <Table.HCell is_right>Date</Table.HCell>
               <Table.HCell>Category</Table.HCell>
               <Table.HCell>Payment Method</Table.HCell>
               <Table.HCell>Account</Table.HCell>
               <Table.HCell>Actions</Table.HCell>
            </Table.Row>
         </Table.Head>
         <Table.Body>
            {transactions.map((transaction, index) => (
               <Table.Row key={transaction.id} odd={index % 2 === 0}>
                  <Table.Cell>{transaction.title}</Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-indigo-400">
                        {transaction.type === 'income'
                           ? '+ ' +
                             methods.format_currency(
                                Number(transaction.amount) || 0
                             )
                           : ''}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-red-400">
                        {transaction.type === 'expense'
                           ? '- ' +
                             methods.format_currency(
                                Number(transaction.amount) || 0
                             )
                           : ''}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{transaction.date}</Table.Cell>
                  <Table.Cell>{transaction.category || ''}</Table.Cell>
                  <Table.Cell>{transaction.payment_method || ''}</Table.Cell>
                  <Table.Cell>{transaction.account || ''}</Table.Cell>
                  <Table.Cell>
                     <Button.Group>
                        <Button.Icon
                           is_small
                           onClick={() => update(transaction)}
                        >
                           <Icon.Edit size={16} tw="stroke-current" />
                        </Button.Icon>
                        <Button.Icon is_small>
                           <Icon.Delete
                              size={16}
                              tw="stroke-current"
                              onClick={() =>
                                 remove({
                                    variables: { id: transaction.id },
                                 })
                              }
                           />
                        </Button.Icon>
                     </Button.Group>
                  </Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}
