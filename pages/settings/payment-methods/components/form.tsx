import React from 'react'
import Head from 'next/head'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useQuery } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'

import * as Icon from 'icons'
import { useUser } from 'lib/user'
import QUERIES from 'graphql/queries'
import { MUTATIONS } from 'graphql/mutations'
import { Loader } from '../../../../components'

type Inputs = {
   title: string
}

const CreatePaymentMethod = ({ closeModal }: { closeModal: () => void }) => {
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
            closeModal()
            router.push(`/settings/payment-methods`)
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
         if (!payment_method?.id) {
            closeModal()
            router.push(`/settings/payment-methods`)
         }
         if (payment_method.user_id !== user.id) {
            closeModal()
            router.push(`/settings/payment-methods`)
         }

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
      <>
         <Head>
            <title>{`${
               FORM_TYPE === 'CREATE' ? 'Create' : 'Edit'
            } Payment Method`}</title>
         </Head>
         <header tw="px-4 pt-4 flex items-center justify-between">
            <h1 tw="font-heading text-xl font-medium text-gray-400">
               {FORM_TYPE === 'CREATE' ? 'Create' : 'Edit'} Payment Method
            </h1>
            <button
               title="Close Modal"
               onClick={closeModal}
               tw="cursor-pointer h-8 w-8 border border-dark-200 flex items-center justify-center hover:bg-dark-300"
            >
               <Icon.Cross tw="stroke-current text-white" />
            </button>
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
                        title="Save"
                        type="submit"
                        disabled={
                           !isFormValid ||
                           creating_payment_method ||
                           updating_payment_method
                        }
                        tw="bg-green-500 h-10 px-6 text-white hover:bg-green-600 disabled:(cursor-not-allowed opacity-50 hover:bg-green-500)"
                     >
                        {creating_payment_method || updating_payment_method
                           ? 'Saving'
                           : 'Save'}
                     </button>
                  </form>
               )}
            </>
         )}
      </>
   )
}

export default CreatePaymentMethod

const Styles = {
   Label: tw.label`mb-1 block uppercase tracking-wide text-xs text-gray-400`,
   Text: styled.input({
      ...tw`px-2 bg-transparent focus:outline-none w-full flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
   }),
   Error: tw.span`inline-block mt-1 text-red-400`,
}
