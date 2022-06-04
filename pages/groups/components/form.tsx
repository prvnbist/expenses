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
import { Loader } from '../../../components'
import { MUTATIONS } from 'graphql/mutations'

type Inputs = {
   title: string
   description: string
}

const CreateGroup = ({ closeModal }: { closeModal: () => void }) => {
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
   const [create_group, { loading: creating_group }] = useMutation(
      MUTATIONS.GROUPS.CREATE,
      {
         refetchQueries: ['groups'],
         onCompleted: () => {
            reset()
            addToast('Successfully added the group', {
               appearance: 'success',
            })
            closeModal()
            router.push(`/groups`)
         },
         onError: () =>
            addToast('Failed to add the group', {
               appearance: 'error',
            }),
      }
   )
   const [update_group, { loading: updating_group }] = useMutation(
      MUTATIONS.GROUPS.UPDATE,
      {
         refetchQueries: ['groups'],
         onCompleted: () =>
            addToast('Successfully updated the group', {
               appearance: 'success',
            }),
         onError: () =>
            addToast('Failed to update the group', {
               appearance: 'error',
            }),
      }
   )

   useQuery(QUERIES.GROUPS.ONE, {
      fetchPolicy: 'network-only',
      variables: { id: router.query.id },
      skip: !router.isReady || FORM_TYPE === 'CREATE',
      onCompleted: ({ group = {} }) => {
         if (!group?.id) {
            closeModal()
            router.push(`/groups`)
         }
         if (group.user_id !== user.id) {
            closeModal()
            router.push(`/groups`)
         }

         setValue('title', group.title, { shouldValidate: true })
         setValue('description', group.description, { shouldValidate: true })
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
            create_group({
               variables: {
                  object: {
                     user_id: user.id,
                     title: data.title,
                     description: data.description,
                  },
               },
            })
         } else if (FORM_TYPE === 'EDIT') {
            update_group({
               variables: {
                  id: router.query.id,
                  _set: {
                     title: data.title,
                     description: data.description,
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
            } Group`}</title>
         </Head>
         <header tw="px-4 pt-4 flex items-center justify-between">
            <h1
               data-test="page-title"
               tw="font-heading text-2xl font-medium text-gray-400"
            >
               {FORM_TYPE === 'CREATE' ? 'Create' : 'Edit'} Group
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
                           data-test="title"
                           placeholder="Enter the title"
                        />
                        {errors.title?.type === 'required' && (
                           <Styles.Error data-test="title-required">
                              Please fill the title
                           </Styles.Error>
                        )}
                        {errors.title?.type === 'minLength' && (
                           <Styles.Error data-test="title-too-short">
                              Title is too short
                           </Styles.Error>
                        )}
                        {errors.title?.type === 'maxLength' && (
                           <Styles.Error data-test="title-too-long">
                              Title is too long
                           </Styles.Error>
                        )}
                     </fieldset>
                     <fieldset>
                        <Styles.Label htmlFor="description">
                           Description
                        </Styles.Label>
                        <Styles.TextArea
                           {...register('description', {
                              minLength: 2,
                              maxLength: 320,
                           })}
                           rows="5"
                           id="description"
                           name="description"
                           data-test="description"
                           placeholder="Enter the description"
                        />
                        {errors.description?.type === 'required' && (
                           <Styles.Error>
                              Please fill the description
                           </Styles.Error>
                        )}
                        {errors.description?.type === 'minLength' && (
                           <Styles.Error>Description is too short</Styles.Error>
                        )}
                        {errors.description?.type === 'maxLength' && (
                           <Styles.Error>Description is too long</Styles.Error>
                        )}
                     </fieldset>
                     <button
                        type="submit"
                        data-test="submit"
                        disabled={creating_group || updating_group}
                        tw="border border-dark-200 h-10 px-3 text-white hover:bg-dark-300 disabled:(cursor-not-allowed opacity-50 hover:bg-transparent)"
                     >
                        {creating_group || updating_group ? 'Saving' : 'Save'}
                     </button>
                  </form>
               )}
            </>
         )}
      </>
   )
}

export default CreateGroup

const Styles = {
   Label: tw.label`mb-1 block uppercase tracking-wide text-xs text-gray-400`,
   Text: styled.input({
      ...tw`px-2 bg-transparent focus:outline-none w-full flex items-center border text-gray-300 h-10 border-dark-200 focus-within:border-indigo-500`,
   }),
   TextArea: styled.textarea({
      ...tw`pt-1 px-2 bg-transparent focus:outline-none w-full flex items-center border text-gray-300 border-dark-200 focus-within:border-indigo-500`,
   }),
   Error: tw.span`inline-block mt-1 text-red-400`,
}
