import React from 'react'
import tw, { styled } from 'twin.macro'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useSubscription } from '@apollo/client'

import { Layout } from '../sections'
import { useConfig } from '../context'
import * as Icon from '../assets/icons'
import { ACCOUNTS, DELETE_ACCOUNT, UPSERT_ACCOUNT } from '../graphql'
import { Button, Table, TableLoader } from '../components'

const Accounts = () => {
   const { methods } = useConfig()
   const { addToast } = useToasts()
   const [account, setAccount] = React.useState({})
   const [isFormOpen, setIsFormOpen] = React.useState(false)
   const { loading, data: { accounts = [] } = {} } = useSubscription(ACCOUNTS)
   const [remove] = useMutation(DELETE_ACCOUNT, {
      onCompleted: () => {
         addToast('Successfully deleted the account.', {
            appearance: 'success',
         })
      },
      onError: () => {
         addToast('Failed to delete the account.', { appearance: 'error' })
      },
   })
   return (
      <Layout>
         <header tw="flex items-center justify-between">
            <h1 tw="text-3xl mt-4 mb-3">Accounts</h1>
            <Button.Combo
               icon_left={<Icon.Add tw="stroke-current" />}
               onClick={() => setIsFormOpen(!isFormOpen)}
            >
               Add
            </Button.Combo>
         </header>
         <section style={{ maxHeight: '520px' }}>
            {loading ? (
               <TableLoader cols={4} />
            ) : (
               <Table>
                  <Table.Head>
                     <Table.Row>
                        <Table.HCell>Account</Table.HCell>
                        <Table.HCell is_right>Balance</Table.HCell>
                        <Table.HCell is_right>Total Expense</Table.HCell>
                        <Table.HCell is_right>Total Income</Table.HCell>
                        <Table.HCell is_center>Actions</Table.HCell>
                     </Table.Row>
                  </Table.Head>
                  <Table.Body>
                     {accounts.map((account, index) => (
                        <Table.Row key={account.id} odd={index % 2 === 0}>
                           <Table.Cell>{account.title}</Table.Cell>
                           <Table.Cell is_right>
                              {methods.format_currency(account.balance)}
                           </Table.Cell>
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
                           <Table.Cell is_center>
                              <Button.Group>
                                 <Button.Icon
                                    is_small
                                    onClick={() => {
                                       setAccount(account)
                                       setIsFormOpen(true)
                                    }}
                                 >
                                    <Icon.Edit size={16} tw="stroke-current" />
                                 </Button.Icon>
                                 <Button.Icon
                                    is_small
                                    onClick={() =>
                                       remove({ variables: { id: account.id } })
                                    }
                                 >
                                    <Icon.Delete
                                       size={16}
                                       tw="stroke-current"
                                    />
                                 </Button.Icon>
                              </Button.Group>
                           </Table.Cell>
                        </Table.Row>
                     ))}
                  </Table.Body>
               </Table>
            )}
         </section>
         <ManageAccount
            account={account}
            setAccount={setAccount}
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
         />
      </Layout>
   )
}

export default Accounts

const Styles = {
   Fieldset: styled.fieldset`
      ${tw`flex flex-col space-y-1 mt-2 flex-1`}
   `,
   Label: styled.label`
      ${tw`text-sm text-gray-500 uppercase font-medium tracking-wider`}
   `,
   Text: styled.input`
      ${tw`bg-gray-700 h-10 rounded px-2`}
   `,
}

const ManageAccount = ({
   account = {},
   setAccount,
   isFormOpen,
   setIsFormOpen,
}) => {
   const { addToast } = useToasts()
   const [upsert, { loading }] = useMutation(UPSERT_ACCOUNT, {
      onCompleted: () => {
         let message = ''
         if (account?.id) {
            message = 'Successfully updated the account details.'
         } else {
            message = 'Successfully added the account.'
         }
         setAccount({})
         setIsFormOpen(false)
         addToast(message, { appearance: 'success' })
      },
      onError: () => {
         let message = ''
         if (account?.id) {
            message = 'Failed to update the account details.'
         } else {
            message = 'Failed to add the new account.'
         }
         addToast(message, { appearance: 'error' })
      },
   })

   const handleChange = e => {
      const { name, value } = e.target
      setAccount(existing => ({ ...existing, [name]: value }))
   }

   const handleSubmit = () => {
      const { id = null, title = '', balance = 0 } = account
      upsert({
         variables: {
            objects: [
               {
                  title,
                  balance: Number(balance),
                  ...(id && { id }),
               },
            ],
         },
      })
   }

   if (!isFormOpen) return null
   return (
      <section tw="overflow-y-auto pb-3 fixed left-0 top-0 bottom-0 z-10 bg-gray-800 shadow-xl w-full md:w-6/12 lg:w-5/12 xl:w-4/12">
         <header tw="sticky top-0 flex items-center justify-between px-3 h-16 bg-gray-800 border-b border-gray-700">
            <h1 tw="text-xl">{account?.id ? 'Edit' : 'Add'} Account</h1>
            <Button.Icon
               onClick={() => {
                  setAccount({})
                  setIsFormOpen(!isFormOpen)
               }}
            >
               <Icon.Close tw="stroke-current" />
            </Button.Icon>
         </header>
         <main tw="px-3">
            <Styles.Fieldset>
               <Styles.Label htmlFor="title">Title</Styles.Label>
               <Styles.Text
                  id="title"
                  type="text"
                  name="title"
                  value={account.title}
                  onChange={handleChange}
                  placeholder="Enter the title"
               />
            </Styles.Fieldset>
            <Styles.Fieldset>
               <Styles.Label htmlFor="amount">Balance</Styles.Label>
               <Styles.Text
                  type="text"
                  id="balance"
                  name="balance"
                  value={account.balance}
                  onChange={handleChange}
                  placeholder="Enter the balance"
               />
            </Styles.Fieldset>
            <div tw="h-4" />
            <Button.Text
               is_loading={loading}
               onClick={handleSubmit}
               is_disabled={!account?.title || !account?.balance}
            >
               Submit
            </Button.Text>
         </main>
      </section>
   )
}
