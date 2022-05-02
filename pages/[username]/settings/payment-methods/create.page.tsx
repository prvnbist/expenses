import React from 'react'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useQuery } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'

import { useUser } from 'lib/user'
import Layout from 'sections/layout'
import QUERIES from 'graphql/queries'
import { MUTATIONS } from 'graphql/mutations'
import { Loader } from '../../../../components'

type Inputs = {
   title: string
}

const CreatePaymentMethod = () => {
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
   const [create_payment_method, { loading: creating_payment_method }] =
      useMutation(MUTATIONS.PAYMENT_METHODS.CREATE, {
         refetchQueries: ['payment_methods'],
         onCompleted: () => {
            reset()
            addToast('Successfully added the payment method.', {
               appearance: 'success',
            })
            router.push(`/${user.username}/settings/payment-methods`)
         },
         onError: () =>
            addToast('Failed to add the payment method.', {
               appearance: 'error',
            }),
      })
   const [update_payment_method, { loading: updating_payment_method }] =
      useMutation(MUTATIONS.PAYMENT_METHODS.UPDATE, {
         refetchQueries: ['payment_methods'],
         onCompleted: () =>
            addToast('Successfully updated the payment method.', {
               appearance: 'success',
            }),
         onError: () =>
            addToast('Failed to update the payment method.', {
               appearance: 'error',
            }),
      })

   useQuery(QUERIES.PAYMENT_METHODS.ONE, {
      fetchPolicy: 'network-only',
      variables: { id: router.query.id },
      skip: !router.isReady || FORM_TYPE === 'CREATE',
      onCompleted: ({ payment_method = {} }) => {
         if (!payment_method?.id) return
         if (payment_method.user_id !== user.id)
            router.push(`/${user.username}/settings/payment-methods`)

         setValue('title', payment_method.title, { shouldValidate: true })
         setStatus('SUCCESS')
      },
      onError: () => {
         setStatus('ERROR')
      },
   })

   const isFormValid = [...watch(['title'])].every(node => node)

   const onSubmit: SubmitHandler<Inputs> = data => {
      if (isFormValid) {
         if (FORM_TYPE === 'CREATE') {
            create_payment_method({
               variables: {
                  object: {
                     user_id: user.id,
                     title: data.title,
                  },
               },
            })
         } else if (FORM_TYPE === 'EDIT') {
            update_payment_method({
               variables: {
                  id: router.query.id,
                  _set: {
                     title: data.title,
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
               {FORM_TYPE === 'CREATE' ? 'Create' : 'Edit'} Payment Method
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
                     <button
                        type="submit"
                        disabled={
                           creating_payment_method || updating_payment_method
                        }
                        tw="border border-dark-200 h-10 px-3 text-white hover:bg-dark-300 disabled:(cursor-not-allowed opacity-50 hover:bg-transparent)"
                     >
                        {creating_payment_method || updating_payment_method
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

export default CreatePaymentMethod

const Styles = {
   Label: tw.label`mb-1 block uppercase tracking-wide text-sm text-gray-400`,
   Text: styled.input({
      ...tw`px-2 bg-transparent focus:outline-none w-full flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
   }),
   Error: tw.span`inline-block mt-1 text-red-400`,
}
