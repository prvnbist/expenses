import tw from 'twin.macro'
import { useSubscription } from '@apollo/client'

import { ACCOUNTS } from '../graphql'
import { Layout } from '../sections'
import { useConfig } from '../context'
import { Table, TableLoader } from '../components'

const Accounts = () => {
   const { methods } = useConfig()
   const { loading, data: { accounts = [] } = {} } = useSubscription(ACCOUNTS)
   return (
      <Layout>
         <header tw="mb-3 flex items-center justify-between">
            <h1 tw="text-3xl mt-4 mb-3">Accounts</h1>
         </header>
         <section style={{ maxHeight: '520px' }}>
            {loading ? (
               <TableLoader />
            ) : (
               <Table>
                  <Table.Head>
                     <Table.Row>
                        <Table.HCell>Account</Table.HCell>
                        <Table.HCell is_right>Total Expense</Table.HCell>
                        <Table.HCell is_right>Total Income</Table.HCell>
                     </Table.Row>
                  </Table.Head>
                  <Table.Body>
                     {accounts.map((account, index) => (
                        <Table.Row odd={index % 2 === 0}>
                           <Table.Cell>{account.title}</Table.Cell>
                           <Table.Cell is_right>
                              <span tw="font-medium text-red-400">
                                 -{' '}
                                 {methods.format_currency(account.expense_sum)}{' '}
                                 ({account.expense_count})
                              </span>
                           </Table.Cell>
                           <Table.Cell is_right>
                              <span tw="font-medium text-indigo-400">
                                 + {methods.format_currency(account.income_sum)}{' '}
                                 ({account.income_count})
                              </span>
                           </Table.Cell>
                        </Table.Row>
                     ))}
                  </Table.Body>
               </Table>
            )}
         </section>
      </Layout>
   )
}

export default Accounts
