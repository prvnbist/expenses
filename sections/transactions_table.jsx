import tw from 'twin.macro'
import { useConfig } from '../context'
import * as Icon from '../assets/icons'
import { Button, Table, TableLoader } from '../components'
import { useTransactions } from '../hooks/useTransactions'

export const TableView = () => {
   const { methods } = useConfig()
   const {
      is_loading,
      transactions,
      remove,
      update,
      setWhere,
   } = useTransactions()

   const viewBy = (key, value) => {
      if (!value) return
      setWhere(existing => ({
         ...existing,
         [key]: { _eq: value },
      }))
   }

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
                        {!!transaction.credit &&
                           `+ ${methods.format_currency(
                              Number(transaction.credit)
                           )}`}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-red-400">
                        {!!transaction.debit &&
                           `- ${methods.format_currency(
                              Number(transaction.debit)
                           )}`}
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>{transaction.date}</Table.Cell>
                  <Table.Cell>
                     <Tag
                        title={transaction.category}
                        onClick={() => viewBy('category', transaction.category)}
                     >
                        {transaction.category}
                     </Tag>
                  </Table.Cell>
                  <Table.Cell>
                     <Tag
                        title={transaction.payment_method}
                        onClick={() =>
                           viewBy('payment_method', transaction.payment_method)
                        }
                     >
                        {transaction.payment_method}
                     </Tag>
                  </Table.Cell>
                  <Table.Cell>
                     <Tag
                        title={transaction.account}
                        onClick={() => viewBy('account', transaction.account)}
                     >
                        {transaction.account}
                     </Tag>
                  </Table.Cell>
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

const Tag = tw.button`rounded px-1 bg-indigo-200 text-indigo-900 cursor-pointer text-sm font-medium focus:(bg-indigo-300)`
