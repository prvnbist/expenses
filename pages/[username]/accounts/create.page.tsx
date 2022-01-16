import React from 'react'
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
   amount: string
}

const CreateAccount = () => {
   const { user } = useUser()
   const router = useRouter()
   const { addToast } = useToasts()
   const FORM_TYPE = router.query.id ? 'EDIT' : 'CREATE'
   const [status, setStatus] = React.useState(
      FORM_TYPE === 'EDIT' ? 'LOADING' : 'SUCCESS'
   )

   const {
      watch,
      reset,
      register,
      setValue,
      handleSubmit,
      formState: { errors },
   } = useForm<Inputs>()
   const [create_account, { loading: creating_account }] = useMutation(
      MUTATIONS.ACCOUNTS.CREATE,
      {
         refetchQueries: ['accounts'],
         onCompleted: () => {
            reset()
            addToast('Successfully added the account', {
               appearance: 'success',
            })
            router.push(`/${user.username}/accounts`)
         },
         onError: () =>
            addToast('Failed to add the account', {
               appearance: 'error',
            }),
      }
   )
   const [update_account, { loading: updating_account }] = useMutation(
      MUTATIONS.ACCOUNTS.UPDATE,
      {
         refetchQueries: ['accounts'],
         onCompleted: () =>
            addToast('Successfully updated the account', {
               appearance: 'success',
            }),
         onError: () =>
            addToast('Failed to update the account', {
               appearance: 'error',
            }),
      }
   )

   useQuery(QUERIES.ACCOUNTS.ONE, {
      fetchPolicy: 'network-only',
      variables: { id: router.query.id },
      skip: !router.isReady || FORM_TYPE === 'CREATE',
      onCompleted: ({ account = {} }) => {
         if (!account?.id) return
         if (account.user_id !== user.id)
            router.push(`/${user.username}/accounts`)

         setValue('title', account.title, { shouldValidate: true })
         setValue('amount', `${account.amount / 100}`, { shouldValidate: true })
         setStatus('SUCCESS')
      },
      onError: () => {
         setStatus('ERROR')
      },
   })

   const isFormValid = [...watch(['title', 'amount'])].every(node => node)

   const onSubmit: SubmitHandler<Inputs> = data => {
      if (isFormValid) {
         if (FORM_TYPE === 'CREATE') {
            create_account({
               variables: {
                  object: {
                     user_id: user.id,
                     title: data.title,
                     amount: parseFloat(data.amount) * 100,
                  },
               },
            })
         } else if (FORM_TYPE === 'EDIT') {
            update_account({
               variables: {
                  id: router.query.id,
                  _set: {
                     title: data.title,
                     amount: parseFloat(data.amount) * 100,
                  },
               },
            })
         }
      }
   }

   return (
      <Layout>
         <header tw="px-4 pt-4">
            <h1 tw="font-heading text-3xl font-medium text-gray-400">
               {FORM_TYPE === 'CREATE' ? 'Create' : 'Edit'} Account
            </h1>
         </header>
         {status === 'LOADING' ? (
            <Loader />
         ) : (
            <>
               {status === 'ERROR' ? (
                  <p>Something went wrong, please try again!</p>
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
                     <button
                        type="submit"
                        disabled={creating_account || updating_account}
                        tw="border border-dark-200 h-10 px-3 text-white hover:bg-dark-300 disabled:(cursor-not-allowed opacity-50 hover:bg-transparent)"
                     >
                        {creating_account || updating_account
                           ? 'Saving'
                           : 'Save'}
                     </button>
                  </form>
               )}
            </>
         )}
      </Layout>
   )
}

export default CreateAccount

const Styles = {
   Label: tw.label`mb-1 block uppercase tracking-wide text-sm text-gray-400`,
   Text: styled.input({
      ...tw`px-2 bg-transparent focus:outline-none w-full flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
   }),
   Error: tw.span`inline-block mt-1 text-red-400`,
}
