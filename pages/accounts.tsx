import React from 'react'
import tw from 'twin.macro'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useSubscription } from '@apollo/client'

import { Layout } from '../sections'
import * as Svg from '../assets/svgs'
import { useConfig } from '../context'
import * as Icon from '../assets/icons'
import { Button, Loader, Table } from '../components'
import { ACCOUNTS, DELETE_ACCOUNT, UPSERT_ACCOUNT } from '../graphql'

const Accounts = (): JSX.Element => {
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
         {loading ? (
            <Loader />
         ) : (
            <>
               {accounts.length === 0 ? (
                  <div tw="my-6 w-full flex items-center justify-center">
                     <Svg.Empty message="No accounts yet!" />
                  </div>
               ) : (
                  <>
                     <main
                        style={{ maxHeight: '520px' }}
                        tw="flex-1 hidden md:block"
                     >
                        <TableView
                           remove={remove}
                           accounts={accounts}
                           setAccount={setAccount}
                           setIsFormOpen={setIsFormOpen}
                        />
                     </main>
                     <main tw="md:hidden">
                        <CardView
                           remove={remove}
                           accounts={accounts}
                           setAccount={setAccount}
                           setIsFormOpen={setIsFormOpen}
                        />
                     </main>
                  </>
               )}
            </>
         )}
         <ReactModal
            isOpen={isFormOpen}
            onRequestClose={() => setIsFormOpen(false)}
         >
            <ManageAccount
               account={account}
               setAccount={setAccount}
               setIsFormOpen={setIsFormOpen}
            />
         </ReactModal>
      </Layout>
   )
}

export default Accounts

interface IAccountInput {
   id?: string
   title?: string
   balance?: number
}

interface IAccount {
   id: string
   title: string
   balance: number
   expense_sum: number
   expense_count: number
   income_sum: number
   income_count: number
}

interface ITableOrCardView {
   accounts: IAccount[]
   setIsFormOpen: (x: boolean) => void
   setAccount: (x: IAccountInput) => void
   remove: (x: { variables: { id: string } }) => void
}

const TableView = ({
   setAccount,
   setIsFormOpen,
   remove,
   accounts,
}: ITableOrCardView): JSX.Element => {
   const { methods } = useConfig()
   return (
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
                        - {methods.format_currency(account.expense_sum)} (
                        {account.expense_count})
                     </span>
                  </Table.Cell>
                  <Table.Cell is_right>
                     <span tw="font-medium text-indigo-400">
                        + {methods.format_currency(account.income_sum)} (
                        {account.income_count})
                     </span>
                  </Table.Cell>
                  <Table.Cell is_center>
                     <Button.Group>
                        <Button.Icon
                           is_small
                           variant="ghost"
                           onClick={() => {
                              setAccount(account)
                              setIsFormOpen(true)
                           }}
                        >
                           <Icon.Edit size={16} tw="stroke-current" />
                        </Button.Icon>
                        <Button.Icon
                           is_small
                           variant="ghost"
                           onClick={() =>
                              remove({ variables: { id: account.id } })
                           }
                        >
                           <Icon.Delete size={16} tw="stroke-current" />
                        </Button.Icon>
                     </Button.Group>
                  </Table.Cell>
               </Table.Row>
            ))}
         </Table.Body>
      </Table>
   )
}

const CardView = ({
   setAccount,
   setIsFormOpen,
   remove,
   accounts,
}: ITableOrCardView): JSX.Element => {
   const { methods } = useConfig()

   return (
      <ul tw="space-y-2">
         {accounts.map(account => (
            <li key={account.id} tw="list-none bg-dark-300 rounded p-3">
               <header tw="flex items-center justify-between">
                  <h3 tw="text-lg">
                     {account.title} ({methods.format_currency(account.balance)}
                     )
                  </h3>
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
                        <Icon.Delete size={16} tw="stroke-current" />
                     </Button.Icon>
                  </Button.Group>
               </header>
               <main tw="mt-3">
                  <section tw="pt-2 divide-x divide-dark-200 border-t border-dark-200 grid grid-cols-2 text-center">
                     <span title="Total Expenses" tw="text-red-400">
                        - {methods.format_currency(account.expense_sum)}(
                        {account.expense_count})
                     </span>
                     <span title="Total Income" tw="text-indigo-400">
                        + {methods.format_currency(account.income_sum)}(
                        {account.income_count})
                     </span>
                  </section>
               </main>
            </li>
         ))}
      </ul>
   )
}

const Styles = {
   Fieldset: styled.fieldset`
      ${tw`flex flex-col space-y-1 mt-2 flex-1`}
   `,
   Label: styled.label`
      ${tw`text-xs text-gray-500 uppercase font-medium tracking-wider`}
   `,
   Text: styled.input`
      ${tw`text-sm bg-dark-300 h-10 rounded px-2`}
   `,
}

interface IManageAccount {
   account: IAccountInput
   setIsFormOpen: (x: any) => void
   setAccount: (x: IAccountInput | {}) => void | IAccountInput
}

const ManageAccount = ({
   account,
   setAccount,
   setIsFormOpen,
}: IManageAccount): JSX.Element => {
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

   return (
      <section tw="">
         <header tw="pl-3 pr-2 flex items-center justify-between h-12 border-b border-dark-200">
            <h3>{account?.id ? 'Edit' : 'Add'} Account</h3>
            <Button.Icon
               is_small
               onClick={() => {
                  setAccount({})
                  setIsFormOpen(_isFormOpen => !_isFormOpen)
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
