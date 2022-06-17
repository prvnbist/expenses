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

const CreateCategory = ({ closeModal }: { closeModal: () => void }) => {
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
   const [type, setType] = React.useState<'expense' | 'income'>('expense')
   const [create_category, { loading: creating_category }] = useMutation(
      MUTATIONS.CATEGORIES.CREATE,
      {
         refetchQueries: ['categories'],
         onCompleted: () => {
            reset()
            addToast('Successfully added the category', {
               appearance: 'success',
            })
            closeModal()
            router.push(`/settings/categories`)
         },
         onError: () =>
            addToast('Failed to add the category', {
               appearance: 'error',
            }),
      }
   )
   const [update_category, { loading: updating_category }] = useMutation(
      MUTATIONS.CATEGORIES.UPDATE,
      {
         refetchQueries: ['categories'],
         onCompleted: () =>
            addToast('Successfully updated the category', {
               appearance: 'success',
            }),
         onError: () =>
            addToast('Failed to update the category', {
               appearance: 'error',
            }),
      }
   )

   useQuery(QUERIES.CATEGORIES.ONE, {
      fetchPolicy: 'network-only',
      variables: { id: router.query.id },
      skip: !router.isReady || FORM_TYPE === 'CREATE',
      onCompleted: ({ category = {} }) => {
         if (!category?.id) {
            closeModal()
            router.push(`/settings/categories`)
         }
         if (category.user_id !== user.id) {
            closeModal()
            router.push(`/settings/categories`)
         }

         setType(category.type)
         setValue('title', category.title, { shouldValidate: true })
         setStatus('SUCCESS')
      },
      onError: () => {
         setStatus('ERROR')
      },
   })

   const isFormValid = [...watch(['title']), type].every(node => node)

   const onSubmit: SubmitHandler<Inputs> = data => {
      if (isFormValid) {
         if (FORM_TYPE === 'CREATE') {
            create_category({
               variables: {
                  object: {
                     type,
                     user_id: user.id,
                     title: data.title,
                  },
               },
            })
         } else if (FORM_TYPE === 'EDIT') {
            update_category({
               variables: {
                  id: router.query.id,
                  _set: { title: data.title, type },
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
            } Category`}</title>
         </Head>
         <header tw="px-4 pt-4 flex items-center justify-between">
            <h1 tw="font-heading text-xl font-medium text-gray-400">
               {FORM_TYPE === 'CREATE' ? 'Create' : 'Edit'} Category
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
                     <button
                        title="Save"
                        type="submit"
                        disabled={
                           !isFormValid ||
                           creating_category ||
                           updating_category
                        }
                        tw="bg-green-500 h-10 px-6 text-white hover:bg-green-600 disabled:(cursor-not-allowed opacity-50 hover:bg-green-500)"
                     >
                        {creating_category || updating_category
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

export default CreateCategory

const Styles = {
   Label: tw.label`mb-1 block uppercase tracking-wide text-xs text-gray-400`,
   Text: styled.input({
      ...tw`px-2 bg-transparent focus:outline-none w-full flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
   }),
   Error: tw.span`inline-block mt-1 text-red-400`,
   GroupButton: styled.button({
      ...tw`h-10 flex-1 text-gray-300 rounded`,
      variants: { is_selected: { true: { ...tw`bg-dark-200` } } },
   }),
}
