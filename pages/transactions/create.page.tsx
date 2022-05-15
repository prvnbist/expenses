import React from 'react'
import Select from 'react-select'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useQuery } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'

import { useUser } from 'lib/user'
import Layout from 'sections/layout'
import QUERIES from 'graphql/queries'
import { MUTATIONS } from 'graphql/mutations'
import { Loader } from '../../components'

type Inputs = {
   title: string
   date: string
   amount: string
}

interface IGroup {
   id: string
   title: string
}

interface IPaymentMethod {
   id: string
   title: string
}

interface ICategory {
   id: string
   title: string
}

interface IAccount {
   id: string
   title: string
}

interface ITransaction {
   title: string
   date: string
   amount: number
   user_id: string
   group_id: string | null
   category_id: string | null
   payment_method_id: string | null
   account_id: string | null
   type: 'income' | 'expense'
}

interface ISelectedTypeAccountGroupPaymentMethodState {
   value: string
   label: string
}

const CreateTransaction = () => {
   const { user } = useUser()
   const router = useRouter()
   const { addToast } = useToasts()
   const FORM_TYPE = router.query.id ? 'EDIT' : 'CREATE'
   const [status, setStatus] = React.useState(
      FORM_TYPE === 'EDIT' ? 'LOADING' : 'SUCCESS'
   )
   const [type, setType] = React.useState<'expense' | 'income'>('expense')
   const [selectedCategory, setSelectedCategory] =
      React.useState<ISelectedTypeAccountGroupPaymentMethodState | null>(null)
   const [selectedAccount, setSelectedAccount] =
      React.useState<ISelectedTypeAccountGroupPaymentMethodState | null>(null)
   const [selectedGroup, setSelectedGroup] =
      React.useState<ISelectedTypeAccountGroupPaymentMethodState | null>(null)
   const [selectedPaymentMethod, setSelectedPaymentMethod] =
      React.useState<ISelectedTypeAccountGroupPaymentMethodState | null>(null)
   const {
      watch,
      reset,
      register,
      setValue,
      handleSubmit,
      formState: { errors },
   } = useForm<Inputs>()
   const { loading, data: { categories = [] } = {} } = useQuery(
      QUERIES.CATEGORIES.LIST,
      {
         skip: !user?.id,
         variables: {
            where: {
               _or: [
                  { user_id: { _eq: user.id } },
                  { user_id: { _is_null: true } },
               ],
            },
            where1: {
               _or: [
                  { user_id: { _eq: user.id } },
                  { user_id: { _is_null: true } },
               ],
            },
         },
      }
   )
   const { loading: loading_accounts, data: { accounts = {} } = {} } = useQuery(
      QUERIES.ACCOUNTS.LIST,
      {
         skip: !user?.id,
         variables: { userid: user.id, where: { user_id: { _eq: user.id } } },
      }
   )
   const { loading: loading_groups, data: { groups = {} } = {} } = useQuery(
      QUERIES.GROUPS.LIST,
      {
         skip: !user?.id,
         variables: { userid: user.id, where: { user_id: { _eq: user.id } } },
      }
   )
   const {
      loading: loading_payment_methods,
      data: { payment_methods = {} } = {},
   } = useQuery(QUERIES.PAYMENT_METHODS.LIST, {
      skip: !user?.id,
      variables: { userid: user.id, where: { user_id: { _eq: user.id } } },
   })
   useQuery(QUERIES.TRANSACTIONS.ONE, {
      skip:
         !user.id ||
         !router.isReady ||
         !router.query.id ||
         FORM_TYPE === 'CREATE',
      fetchPolicy: 'network-only',
      variables: {
         where: {
            _and: [
               {
                  user_id: { _eq: user.id },
                  id: { _eq: router.query.id },
               },
            ],
         },
      },
      onCompleted: ({ transactions_view = [] }) => {
         if (transactions_view.length === 0) router.push(`/transactions`)

         const [transaction] = transactions_view

         if (!transaction.id) router.push(`/transactions`)
         if (transaction.user_id !== user.id) router.push(`/transactions`)

         setValue('title', transaction.title, { shouldValidate: true })
         setValue('amount', `${transaction.amount / 100}`, {
            shouldValidate: true,
         })
         setValue('date', transaction.raw_date, { shouldValidate: true })
         setType(transaction.type)
         if (transaction.category_id) {
            setSelectedCategory({
               value: transaction.category_id,
               label: transaction.category,
            })
         }
         if (transaction.account_id) {
            setSelectedAccount({
               value: transaction.account_id,
               label: transaction.account,
            })
         }
         if (transaction.group_id) {
            setSelectedGroup({
               value: transaction.group_id,
               label: transaction.group,
            })
         }
         if (transaction.payment_method_id) {
            setSelectedPaymentMethod({
               value: transaction.payment_method_id,
               label: transaction.payment_method,
            })
         }
         setStatus('SUCCESS')
      },
      onError: () => setStatus('ERROR'),
   })

   const [create_transaction, { loading: creating_transaction }] = useMutation(
      MUTATIONS.TRANSACTIONS.CREATE,
      {
         onCompleted: () => {
            reset()
            setType('expense')
            setSelectedCategory(null)
            setSelectedAccount(null)
            addToast('Successfully added the transaction', {
               appearance: 'success',
            })
            router.push(`/transactions`)
         },
         onError: () =>
            addToast('Failed to add the transaction', {
               appearance: 'error',
            }),
      }
   )
   const [update_transaction, { loading: updating_transaction }] = useMutation(
      MUTATIONS.TRANSACTIONS.UPDATE,
      {
         onCompleted: () =>
            addToast('Successfully updated the transaction', {
               appearance: 'success',
            }),
         onError: () =>
            addToast('Failed to update the transaction', {
               appearance: 'error',
            }),
      }
   )

   const isFormValid = [...watch(['title', 'date', 'amount'])].every(
      node => node
   )

   const onSubmit: SubmitHandler<Inputs> = data => {
      if (!isFormValid) return

      const { title, date, amount } = data

      const transaction: ITransaction = {
         date,
         type,
         title,
         user_id: user.id,
         amount: Math.round(parseFloat(amount) * 100),
         account_id: selectedAccount?.value || null,
         category_id: selectedCategory?.value || null,
         payment_method_id: selectedPaymentMethod?.value || null,
         group_id: selectedGroup?.value || null,
      }
      if (FORM_TYPE === 'CREATE') {
         create_transaction({ variables: { object: transaction } })
      } else if (FORM_TYPE === 'EDIT') {
         const { user_id, ...rest } = transaction
         update_transaction({ variables: { id: router.query.id, _set: rest } })
      }
   }

   return (
      <Layout>
         <header tw="px-4 pt-4">
            <h1 tw="font-heading text-3xl font-medium text-gray-400">
               {FORM_TYPE === 'CREATE' ? 'Create' : 'Edit'} Transaction
            </h1>
         </header>
         {status === 'LOADING' ? (
            <Loader />
         ) : (
            <>
               {status === 'ERROR' ? (
                  <p tw="text-gray-400">
                     Something went wrong, please try again.
                  </p>
               ) : (
                  <form
                     onSubmit={handleSubmit(onSubmit)}
                     tw="w-full max-w-[380px] mt-4 px-4 space-y-3"
                  >
                     <fieldset>
                        <Styles.Label htmlFor="title">Title</Styles.Label>
                        <Styles.Text
                           {...register('title', {
                              required: true,
                              minLength: 2,
                              maxLength: 60,
                           })}
                           id="title"
                           name="title"
                           placeholder="Enter the title"
                        />
                        {errors.title?.type === 'required' && (
                           <Styles.Error>Please fill the title</Styles.Error>
                        )}
                        {errors.title?.type === 'minLength' && (
                           <Styles.Error>Title is too short</Styles.Error>
                        )}
                        {errors.title?.type === 'maxLength' && (
                           <Styles.Error>Title is too long</Styles.Error>
                        )}
                     </fieldset>
                     <fieldset>
                        <Styles.Label htmlFor="amount">
                           Amount{' '}
                           <span tw="text-[12px] float-right normal-case">
                              (Upto two decimals)
                           </span>
                        </Styles.Label>
                        <Styles.Text
                           {...register('amount', {
                              required: true,
                              pattern: /^[\d]{1,}(\.[\d]{1,2})?$/,
                           })}
                           id="amount"
                           name="amount"
                           placeholder="Enter the amount"
                        />
                        {errors.amount?.type === 'required' && (
                           <Styles.Error>Please fill the amount</Styles.Error>
                        )}
                        {errors.amount?.type === 'pattern' && (
                           <Styles.Error>
                              Please enter numbers only
                           </Styles.Error>
                        )}
                     </fieldset>
                     <fieldset>
                        <Styles.Label htmlFor="date">Date</Styles.Label>
                        <Styles.Text
                           {...register('date', {
                              required: true,
                           })}
                           id="date"
                           name="date"
                           type="date"
                           placeholder="Enter the date"
                        />
                        {errors.date?.type === 'required' && (
                           <Styles.Error>Please fill the date</Styles.Error>
                        )}
                     </fieldset>
                     <div tw="flex items-center bg-dark-300 p-1 rounded-lg">
                        <Styles.GroupButton
                           is_selected={type === 'expense'}
                           onClick={(e: React.FormEvent<HTMLInputElement>) => {
                              e.preventDefault()
                              setType('expense')
                           }}
                        >
                           Expense
                        </Styles.GroupButton>
                        <Styles.GroupButton
                           is_selected={type === 'income'}
                           onClick={(e: React.FormEvent<HTMLInputElement>) => {
                              e.preventDefault()
                              setType('income')
                           }}
                        >
                           Income
                        </Styles.GroupButton>
                     </div>
                     <fieldset>
                        <Styles.Label>Category</Styles.Label>
                        <Select
                           isClearable
                           isSearchable
                           name="category"
                           isLoading={loading}
                           classNamePrefix="select"
                           value={selectedCategory}
                           onChange={(option: any) =>
                              setSelectedCategory(option)
                           }
                           options={categories?.nodes?.map(
                              (category: ICategory) => ({
                                 label: category.title,
                                 value: category.id,
                              })
                           )}
                        />
                     </fieldset>
                     <fieldset>
                        <Styles.Label>Payment Method</Styles.Label>
                        <Select
                           isClearable
                           isSearchable
                           name="payment_method"
                           isLoading={loading_payment_methods}
                           classNamePrefix="select"
                           value={selectedPaymentMethod}
                           onChange={(option: any) =>
                              setSelectedPaymentMethod(option)
                           }
                           options={payment_methods?.nodes?.map(
                              (payment_method: IPaymentMethod) => ({
                                 label: payment_method.title,
                                 value: payment_method.id,
                              })
                           )}
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
                           onChange={(option: any) =>
                              setSelectedAccount(option)
                           }
                           options={accounts?.nodes?.map(
                              (account: ICategory) => ({
                                 value: account.id,
                                 label: account.title,
                              })
                           )}
                        />
                     </fieldset>
                     <fieldset>
                        <Styles.Label>Group</Styles.Label>
                        <Select
                           isClearable
                           isSearchable
                           name="group"
                           classNamePrefix="select"
                           value={selectedGroup}
                           isLoading={loading_groups}
                           onChange={(option: any) => setSelectedGroup(option)}
                           options={groups?.nodes?.map((account: IGroup) => ({
                              value: account.id,
                              label: account.title,
                           }))}
                        />
                     </fieldset>
                     <button
                        type="submit"
                        disabled={creating_transaction || updating_transaction}
                        tw="border border-dark-200 h-10 px-3 text-white hover:bg-dark-300 disabled:(cursor-not-allowed opacity-50 hover:bg-transparent)"
                     >
                        {creating_transaction || updating_transaction
                           ? 'Saving...'
                           : 'Save'}
                     </button>
                  </form>
               )}
            </>
         )}
      </Layout>
   )
}

export default CreateTransaction

const Styles = {
   Label: tw.label`mb-1 block uppercase tracking-wide text-sm text-gray-400`,
   Text: styled.input({
      ...tw`px-2 bg-transparent focus:outline-none w-full flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
   }),
   Error: tw.span`inline-block mt-1 text-red-400`,
   GroupButton: styled.button({
      ...tw`h-10 flex-1 text-gray-300 rounded`,
      variants: { is_selected: { true: { ...tw`bg-dark-200` } } },
   }),
}
