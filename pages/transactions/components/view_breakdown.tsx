import React from 'react'
import Head from 'next/head'
import Dinero from 'dinero.js'
import Modal from 'react-modal'
import Select from 'react-select'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { ResponsivePie } from '@nivo/pie'
import { useForm, SubmitHandler } from 'react-hook-form'

import * as Icon from 'icons'
import { useUser } from 'lib/user'
import QUERIES from 'graphql/queries'
import { Loader, Table, Empty } from '../../../components'
import { MUTATIONS } from 'graphql/mutations'

interface ITransaction {
   id: string
   user_id: string
   amount: number
   payee: string
   date: string
   payment_method?: string
   payment_method_id?: string
   account?: string
   account_id?: string
   raw_date?: string
   status: 'PENDING' | 'RECIEVED'
}

const ViewBreakdown = ({ closeModal }: { closeModal: () => void }): JSX.Element => {
   const router = useRouter()
   const { user } = useUser()
   const [status, setStatus] = React.useState('LOADING')
   const [transactions, setTransactions] = React.useState([])

   useQuery(QUERIES.BREAKDOWN.LIST, {
      skip: !user.id || !router.query.id,
      variables: {
         where: {
            user_id: { _eq: user.id },
            transaction_id: { _eq: router.query.id },
         },
      },
      onCompleted: ({ transaction_breakdown = {} }) => {
         setStatus('LOADING')

         if (transaction_breakdown?.aggregate?.count === 0) {
            setStatus('EMPTY')
            setTransactions([])
            return
         }

         setTransactions(transaction_breakdown.nodes)

         setStatus('SUCCESS')
      },
      onError: () => {
         setStatus('ERROR')
      },
   })

   return (
      <>
         <Head>
            <title>Transaction Breakdown</title>
         </Head>
         <header tw="px-4 pt-4 flex items-center justify-between">
            <h1 data-test="modal-title" tw="font-heading text-xl font-medium text-gray-400">
               Transaction Breakdown
            </h1>
            <button
               title="Close Modal"
               onClick={closeModal}
               tw="cursor-pointer h-8 w-8 border border-dark-200 flex items-center justify-center hover:bg-dark-300"
            >
               <Icon.Cross tw="stroke-current text-white" />
            </button>
         </header>
         <main tw="mt-4 px-4">
            <Content status={status} transactions={transactions} />
         </main>
      </>
   )
}

export default ViewBreakdown

interface IContent {
   status: 'LOADING' | 'ERROR' | 'EMPTY'
   transactions: ITransaction[]
}

const Content = ({ status, transactions = [] }: IContent): JSX.Element => {
   const [isModalOpen, setIsModalOpen] = React.useState(false)

   if (status === 'LOADING') return <Loader />
   if (status === 'ERROR') return <p tw="text-gray-400">Something went wrong, please try again.</p>
   if (status === 'EMPTY')
      return (
         <>
            <section tw="flex flex-col items-center justify-center">
               <Empty message="Create a transaction to begin" />
               <button
                  title="Save"
                  onClick={() => setIsModalOpen(true)}
                  tw="w-[160px] mt-[-24px] bg-indigo-600 h-10 px-6 text-white hover:bg-indigo-700 disabled:(cursor-not-allowed opacity-50 hover:bg-indigo-700)"
               >
                  Create
               </button>
            </section>
            <Modal isOpen={isModalOpen} contentLabel="Create Transaction" onRequestClose={() => setIsModalOpen(false)}>
               <Form closeModal={() => setIsModalOpen(false)} />
            </Modal>
         </>
      )
   return (
      <>
         <section tw="h-[240px]">
            <ResponsivePie
               data={transactions.map((transaction: ITransaction) => ({
                  id: transaction.payee,
                  label: transaction.payee,
                  value: transaction.amount,
               }))}
               valueFormat={value =>
                  Dinero({
                     amount: value,
                     currency: 'INR',
                  }).toFormat()
               }
               {...pieChartOptions}
            />
         </section>
         <section tw="overflow-x-auto">
            <Table>
               <Table.Head>
                  <Table.Row>
                     <Table.HCell>Payee</Table.HCell>
                     <Table.HCell is_right>Amount</Table.HCell>
                     <Table.HCell is_right>Paid On</Table.HCell>
                     <Table.HCell is_center>Status</Table.HCell>
                     <Table.HCell>Payment Method</Table.HCell>
                     <Table.HCell>Account</Table.HCell>
                  </Table.Row>
               </Table.Head>
               <Table.Body>
                  {transactions.map(
                     (transaction: ITransaction): JSX.Element => (
                        <Table.Row key={transaction.id}>
                           <Table.Cell>{transaction.payee}</Table.Cell>
                           <Table.Cell is_right>
                              {transaction.status === 'PENDING' ? (
                                 <span tw="font-mono text-red-400">
                                    -
                                    {Dinero({
                                       amount: transaction.amount,
                                       currency: 'INR',
                                    }).toFormat()}
                                 </span>
                              ) : (
                                 <span tw="font-mono text-indigo-400">
                                    +
                                    {Dinero({
                                       amount: transaction.amount,
                                       currency: 'INR',
                                    }).toFormat()}
                                 </span>
                              )}
                           </Table.Cell>
                           <Table.Cell is_right>{transaction.status === 'RECIEVED' && transaction.date}</Table.Cell>
                           <Table.Cell is_center>
                              <Styles.Pill is_pending={transaction.status === 'PENDING'}>{transaction.status}</Styles.Pill>
                           </Table.Cell>
                           <Table.Cell>{transaction.payment_method}</Table.Cell>
                           <Table.Cell>{transaction.account}</Table.Cell>
                        </Table.Row>
                     )
                  )}
                  <Table.Row>
                     <Table.Cell>Total</Table.Cell>
                     <Table.Cell is_right>
                        <span tw="font-mono text-indigo-400">
                           +
                           {Dinero({
                              amount: transactions.reduce((acc: number, transaction: ITransaction) => {
                                 if (transaction.status === 'RECIEVED') {
                                    return acc + transaction.amount
                                 }

                                 return acc
                              }, 0),
                              currency: 'INR',
                           }).toFormat()}
                        </span>
                     </Table.Cell>
                     <Table.Cell></Table.Cell>
                     <Table.Cell></Table.Cell>
                     <Table.Cell></Table.Cell>
                     <Table.Cell></Table.Cell>
                  </Table.Row>
               </Table.Body>
            </Table>
         </section>
         <button
            title="Create"
            onClick={() => setIsModalOpen(true)}
            tw="mt-3 bg-indigo-600 text-sm h-8 px-3 text-white hover:bg-indigo-700 disabled:(cursor-not-allowed opacity-50 hover:bg-indigo-700)"
         >
            Create
         </button>
         <Modal isOpen={isModalOpen} contentLabel="Create Transaction" onRequestClose={() => setIsModalOpen(false)}>
            <Form closeModal={() => setIsModalOpen(false)} />
         </Modal>
      </>
   )
}

type Inputs = {
   payee: string
   amount: number
   date: string
}

interface IAccount {
   id: string
   title: string
}

interface IPaymentMethod {
   id: string
   title: string
}

interface ISelectedTypeAccountPaymentMethodState {
   value: string
   label: string
}

const Form = ({ closeModal }: { closeModal: () => void }) => {
   const router = useRouter()
   const { user } = useUser()
   const [status, setStatus] = React.useState<'PENDING' | 'RECIEVED'>('PENDING')
   const [selectedAccount, setSelectedAccount] = React.useState<ISelectedTypeAccountPaymentMethodState | null>(null)
   const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<ISelectedTypeAccountPaymentMethodState | null>(null)

   const {
      watch,
      reset,
      register,
      setValue,
      handleSubmit,
      formState: { errors },
   } = useForm<Inputs>()

   const [createTransaction] = useMutation(MUTATIONS.BREAKDOWN.CREATE, {
      refetchQueries: ['transaction_breakdown'],
      onCompleted: () => {
         closeModal()
      },
   })

   const { loading: loading_payment_methods, data: { payment_methods = {} } = {} } = useQuery(QUERIES.PAYMENT_METHODS.LIST, {
      skip: !user?.id,
      variables: { userid: user.id, where: { user_id: { _eq: user.id } } },
   })

   const { loading: loading_accounts, data: { accounts = {} } = {} } = useQuery(QUERIES.ACCOUNTS.LIST, {
      skip: !user?.id,
      variables: { userid: user.id, where: { user_id: { _eq: user.id } } },
   })

   const isFormValid = [...watch(['payee', 'amount'])].every(node => node)

   const onSubmit: SubmitHandler<Inputs> = data => {
      const { payee, amount, date } = data
      const transaction = {
         payee,
         status,
         user_id: user.id,
         ...(date && { date }),
         transaction_id: router.query.id,
         account_id: selectedAccount?.value,
         amount: Math.round(parseFloat(amount) * 100),
         payment_method_id: selectedPaymentMethod?.value,
      }
      createTransaction({ variables: { object: transaction } })
   }

   return (
      <>
         <header tw="px-4 pt-4 flex items-center justify-between">
            <h1 data-test="modal-title" tw="font-heading text-xl font-medium text-gray-400">
               Create
            </h1>
            <button
               title="Close Modal"
               onClick={closeModal}
               tw="cursor-pointer h-8 w-8 border border-dark-200 flex items-center justify-center hover:bg-dark-300"
            >
               <Icon.Cross tw="stroke-current text-white" />
            </button>
         </header>
         <form onSubmit={handleSubmit(onSubmit)} tw="px-4 space-y-3 w-full mt-4">
            <fieldset>
               <Styles.Label htmlFor="payee">Payee</Styles.Label>
               <Styles.Text
                  {...register('payee', {
                     required: true,
                     minLength: 2,
                     maxLength: 60,
                  })}
                  id="payee"
                  type="text"
                  name="payee"
                  data-test="payee"
                  placeholder="Payee's name"
               />
            </fieldset>
            <fieldset>
               <Styles.Label htmlFor="amount">
                  Amount<span tw="text-[12px] float-right normal-case">(Upto two decimals)</span>
               </Styles.Label>
               <Styles.Text
                  {...register('amount', {
                     required: true,
                     pattern: /^[\d]{1,}(\.[\d]{1,2})?$/,
                  })}
                  id="amount"
                  name="amount"
                  data-test="amount"
                  placeholder="Enter the amount"
               />
            </fieldset>
            <fieldset>
               <Styles.Label htmlFor="date">Paid on</Styles.Label>
               <Styles.Text {...register('date')} id="date" name="date" type="date" data-test="form-date" placeholder="Paid on" />
            </fieldset>
            <div tw="flex items-center bg-dark-300 p-1 rounded-lg">
               <Styles.GroupButton
                  data-test="form-status__pending"
                  is_selected={status === 'PENDING'}
                  onClick={(e: React.FormEvent<HTMLInputElement>) => {
                     e.preventDefault()
                     setStatus('PENDING')
                  }}
               >
                  Pending
               </Styles.GroupButton>
               <Styles.GroupButton
                  data-test="form-status__recieved"
                  is_selected={status === 'RECIEVED'}
                  onClick={(e: React.FormEvent<HTMLInputElement>) => {
                     e.preventDefault()
                     setStatus('RECIEVED')
                  }}
               >
                  Recieved
               </Styles.GroupButton>
            </div>
            <fieldset>
               <Styles.Label>Payment Method</Styles.Label>
               <Select
                  isClearable
                  isSearchable
                  name="payment_method"
                  isLoading={loading_payment_methods}
                  classNamePrefix="select"
                  value={selectedPaymentMethod}
                  onChange={(option: any) => setSelectedPaymentMethod(option)}
                  options={payment_methods?.nodes?.map((payment_method: IPaymentMethod) => ({
                     label: payment_method.title,
                     value: payment_method.id,
                  }))}
               />
            </fieldset>
            <fieldset>
               <Styles.Label>Account</Styles.Label>
               <Select
                  isClearable
                  isSearchable
                  name="account"
                  classNamePrefix="select"
                  value={selectedAccount}
                  isLoading={loading_accounts}
                  onChange={(option: any) => setSelectedAccount(option)}
                  options={accounts?.nodes?.map((account: IAccount) => ({
                     value: account.id,
                     label: account.title,
                  }))}
               />
            </fieldset>
            <button
               title="Save"
               type="submit"
               data-test="submit"
               disabled={!isFormValid}
               tw="bg-green-500 h-10 px-6 text-white hover:bg-green-600 disabled:(cursor-not-allowed opacity-50 hover:bg-green-500)"
            >
               Save
            </button>
         </form>
      </>
   )
}

const pieChartOptions = {
   margin: { top: 55, right: 55, bottom: 55, left: 55 },
   innerRadius: 0.6,
   padAngle: 0.7,
   cornerRadius: 0,
   activeOuterRadiusOffset: 8,
   borderWidth: 1,
   borderColor: {
      from: 'color',
      modifiers: [['darker', 0.2]],
   },
   enableArcLabels: false,
   arcLinkLabelsSkipAngle: 10,
   arcLinkLabelsTextColor: '#fff',
   arcLinkLabelsThickness: 2,
   arcLinkLabelsColor: { from: 'color' },
}

const Styles = {
   Label: tw.label`mb-1 block uppercase tracking-wide text-xs text-gray-400`,
   Text: styled.input({
      ...tw`text-sm placeholder:text-sm px-2 bg-transparent focus:outline-none w-full flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
   }),
   Pill: styled('span', {
      ...tw`font-medium text-xs tracking-wide px-2 rounded-full`,
      variants: {
         is_pending: {
            true: {
               ...tw`bg-indigo-200 text-indigo-600`,
            },
            false: {
               ...tw`bg-green-200 text-green-600`,
            },
         },
      },
   }),
   GroupButton: styled.button({
      ...tw`h-10 flex-1 text-gray-300 rounded`,
      variants: { is_selected: { true: { ...tw`bg-dark-200` } } },
   }),
}
