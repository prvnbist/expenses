import React from 'react'
import Select from 'react-select'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useQuery } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'

import { useUser } from '../../../lib/user'
import { Loader } from '../../../components'
import Layout from '../../../sections/layout'
import QUERIES from '../../../graphql/queries'
import { MUTATIONS } from '../../../graphql/mutations'

type Inputs = {
   title: string
   date: string
   amount: string
}

interface ISubCategory {
   id: string
   title: string
}

interface ICategory {
   id: string
   title: string
   sub_categories: ISubCategory[]
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
   category_id: string
   account_id: string
   type: 'income' | 'expense'
}

interface ISelectedTypeAccountState {
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
      React.useState<ISelectedTypeAccountState | null>(null)
   const [selectedAccount, setSelectedAccount] =
      React.useState<ISelectedTypeAccountState | null>(null)
   const {
      watch,
      reset,
      register,
      setValue,
      handleSubmit,
      formState: { errors },
   } = useForm<Inputs>()
   const { loading, data: { categories = [] } = {} } = useQuery(
      QUERIES.CATEGORIES.WITH_SUB_CATEGORIES,
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
         variables: { where: { user_id: { _eq: user.id } } },
      }
   )
   useQuery(QUERIES.TRANSACTIONS.ONE, {
      skip: !user.id || !router.isReady || FORM_TYPE === 'CREATE',
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
      onCompleted: ({ transactions_views = [] }) => {
         if (transactions_views.length === 0)
            router.push(`/${user.username}/transactions`)

         const [transaction] = transactions_views

         if (!transaction.id) router.push(`/${user.username}/transactions`)
         if (transaction.user_id !== user.id)
            router.push(`/${user.username}/transactions`)

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
         setStatus('SUCCESS')
      },
      onError: () => setStatus('ERROR'),
   })
   {
      /*
   React.useEffect(() => {
      if (
         !loading &&
         categories.length > 0 &&
         selectedCategory?.value &&
         !selectedCategory?.label
      ) {
         categories.forEach((category: IAccount) => {
            if (category.sub_categories.length > 0) {
               category.sub_categories.forEach((subCategory: ISubCategory) => {
                  if (subCategory.id === selectedCategory.value) {
                     setSelectedCategory({
                        value: subCategory.id,
                        label: subCategory.title,
                     })
                  }
               })
            }
         })
      }
   }, [loading, categories, selectedCategory])
   */
   }

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
            router.push(`/${user.username}/transactions`)
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

   const isFormValid = [
      ...watch(['title', 'date', 'amount']),
      type,
      selectedCategory?.value,
      selectedAccount?.value,
   ].every(node => node)

   const onSubmit: SubmitHandler<Inputs> = data => {
      if (!isFormValid) return

      const { title, date, amount } = data

      const transaction: ITransaction = {
         date,
         type,
         title,
         user_id: user.id,
         amount: parseFloat(amount) * 100,
         category_id: selectedCategory?.value || '',
         account_id: selectedAccount?.value || '',
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
                           options={categories.map((category: IAccount) => ({
                              label: category.title,
                              options: category.sub_categories.map(
                                 (sub_category: ISubCategory) => ({
                                    value: sub_category.id,
                                    label: sub_category.title,
                                 })
                              ),
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
