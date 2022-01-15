import React from 'react'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'
import { useToasts } from 'react-toast-notifications'
import { useMutation, useQuery } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'

import { useUser } from '../../../../../lib/user'
import { Loader } from '../../../../../components'
import Layout from '../../../../../sections/layout'
import QUERIES from '../../../../../graphql/queries'
import { MUTATIONS } from '../../../../../graphql/mutations'

type Inputs = {
   title: string
}

const CreateSubCategory = () => {
   const { user } = useUser()
   const router = useRouter()
   const { addToast } = useToasts()
   const sub_category_id = router.asPath?.split('?id=')[1] || ''
   const FORM_TYPE = sub_category_id ? 'EDIT' : 'CREATE'
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
   const [create_sub_category, { loading: creating_sub_category }] =
      useMutation(MUTATIONS.SUB_CATEGORIES.CREATE, {
         refetchQueries: ['category'],
         onCompleted: () => {
            reset()
            addToast('Successfully added the sub category', {
               appearance: 'success',
            })
            router.push(
               `/${user.username}/settings/categories/${router.query.id}`
            )
         },
         onError: () =>
            addToast('Failed to add the sub category', {
               appearance: 'error',
            }),
      })
   const [update_sub_category, { loading: updating_sub_category }] =
      useMutation(MUTATIONS.SUB_CATEGORIES.UPDATE, {
         refetchQueries: ['category'],
         onCompleted: () =>
            addToast('Successfully updated the sub category', {
               appearance: 'success',
            }),
         onError: () =>
            addToast('Failed to update the sub category', {
               appearance: 'error',
            }),
      })

   useQuery(QUERIES.SUB_CATEGORIES.ONE, {
      fetchPolicy: 'network-only',
      variables: { id: sub_category_id },
      skip: !router.isReady || FORM_TYPE === 'CREATE',
      onCompleted: ({ sub_category = {} }) => {
         if (!sub_category?.id) return
         if (sub_category.user_id !== user.id)
            router.push(
               `/${user.username}/settings/categories/${router.query.id}`
            )

         setValue('title', sub_category.title, { shouldValidate: true })
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
            create_sub_category({
               variables: {
                  object: {
                     user_id: user.id,
                     title: data.title,
                     category_id: router.query.id,
                  },
               },
            })
         } else if (FORM_TYPE === 'EDIT') {
            update_sub_category({
               variables: {
                  id: sub_category_id,
                  _set: { title: data.title },
               },
            })
         }
      }
   }

   return (
      <Layout>
         <header tw="px-4 pt-4">
            <h1 tw="font-heading text-3xl font-medium text-gray-400">
               {FORM_TYPE === 'CREATE' ? 'Create' : 'Edit'} Sub Category
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
                           creating_sub_category || updating_sub_category
                        }
                        tw="border border-dark-200 h-10 px-3 text-white hover:bg-dark-300 disabled:(cursor-not-allowed opacity-50 hover:bg-transparent)"
                     >
                        {creating_sub_category || updating_sub_category
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

export default CreateSubCategory

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
