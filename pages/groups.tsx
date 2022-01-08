import React from 'react'
import ReactModal from 'react-modal'
import tw, { styled } from 'twin.macro'
import { useMutation, useQuery } from '@apollo/client'
import { useToasts } from 'react-toast-notifications'

import { Layout } from '../sections'
import { Empty } from '../assets/svgs'
import * as Icon from '../assets/icons'
import { Button, Loader } from '../components'
import { DELETE_GROUP, GROUPS, INSERT_GROUP, UPDATE_GROUP } from '../graphql'

const Groups = (): JSX.Element => {
   return (
      <Layout>
         <List />
      </Layout>
   )
}

export default Groups

const List = () => {
   const [isModalOpen, setIsModalOpen] = React.useState(false)
   const [form, setForm] = React.useState({
      id: null,
      title: '',
      description: '',
   })
   const { loading, error, data: { groups = [] } = {} } = useQuery(GROUPS)

   const closeModal = () => {
      setForm({
         id: null,
         title: '',
         description: '',
      })
      setIsModalOpen(false)
   }

   if (loading) return <Loader />
   if (error) return <p>Failed to load groups.</p>
   if (groups.length === 0)
      return <Empty message="Start by creating a new group!" />
   return (
      <div>
         <header tw="flex items-center gap-3 mb-4">
            <h1 tw="text-2xl">Groups</h1>
            <Button.Icon is_small onClick={() => setIsModalOpen(true)}>
               <Icon.Add tw="stroke-current" />
            </Button.Icon>
         </header>
         <Styles.Groups>
            {groups.map(group => (
               <Styles.Group key={group.id}>
                  <h2 tw="border-l border-indigo-700 border-l-2 py-3 px-3 text-lg truncate">
                     {group.title}
                  </h2>
                  <p tw="px-3 mt-3 text-gray-500 mb-3">{group.description}</p>
                  <footer tw="w-full justify-end mt-auto flex gap-3 px-3 border-t border-dark-200 pt-3">
                     <Button.Icon
                        variant="outline"
                        onClick={() => {
                           const { __typename, ...rest } = group
                           setForm({
                              id: rest.id ?? null,
                              title: rest.title ?? '',
                              description: rest.description ?? '',
                           })
                           setIsModalOpen(true)
                        }}
                     >
                        <Icon.Edit size={16} tw="stroke-current" />
                     </Button.Icon>
                  </footer>
               </Styles.Group>
            ))}
         </Styles.Groups>
         <ReactModal isOpen={isModalOpen} onRequestClose={closeModal}>
            <ManageGroup form={form} close={closeModal} />
         </ReactModal>
      </div>
   )
}

const Styles = {
   Groups: styled.ul`
      display: grid;
      grid-gap: 16px;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
   `,
   Group: styled.li`
      ${tw`flex flex-col border border-dark-200 rounded py-3`}
   `,
   Fieldset: styled.fieldset`
      ${tw`flex flex-col space-y-1 mt-3 flex-1`}
   `,
   Label: styled.label`
      ${tw`text-xs text-gray-500 uppercase font-medium tracking-wider`}
   `,
   Text: styled.input`
      ${tw`text-sm bg-dark-200 h-10 rounded px-2`}
   `,
   TextArea: styled.textarea`
      ${tw`text-sm bg-dark-200 rounded px-2 pt-2`}
   `,
}

interface IManageGroupProps {
   close: () => void
   form: {
      id: string
      title: string
      description: string
   }
}

const ManageGroup = ({
   close,
   form: original_form,
}: IManageGroupProps): JSX.Element => {
   const { addToast } = useToasts()
   const formType = original_form.id ? 'EDIT' : 'NEW'
   const [form, setForm] = React.useState(original_form)
   const [update_group, { loading: updating_group }] = useMutation(
      UPDATE_GROUP,
      {
         refetchQueries: ['groups'],
         onCompleted: () => {
            addToast('Successfully updated the group details.', {
               appearance: 'success',
            })
            close()
         },
         onError: () =>
            addToast('Failed to update the group details.', {
               appearance: 'error',
            }),
      }
   )
   const [insert_group, { loading: inserting_group }] = useMutation(
      INSERT_GROUP,
      {
         refetchQueries: ['groups'],
         onCompleted: () => {
            addToast('Successfully created the group.', {
               appearance: 'success',
            })
            close()
         },
         onError: () =>
            addToast('Failed to create the group.', {
               appearance: 'error',
            }),
      }
   )
   const [delete_group] = useMutation(DELETE_GROUP, {
      refetchQueries: ['groups'],
      onCompleted: () => {
         addToast('Successfully deleted the group.', {
            appearance: 'success',
         })
         close()
      },
      onError: () =>
         addToast('Failed to deleted the group.', {
            appearance: 'error',
         }),
   })

   const isFormValid = Boolean(form?.title)

   const upsert = () => {
      if (formType === 'EDIT') {
         const { id, ...rest } = form
         update_group({
            variables: {
               _set: rest,
               where: { id: { _eq: form?.id } },
            },
         })
      } else if (formType === 'NEW') {
         insert_group({
            variables: {
               objects: [
                  {
                     title: form.title,
                     description: form.description ?? '',
                  },
               ],
            },
         })
      }
   }

   return (
      <div>
         <header tw="pl-3 pr-2 flex items-center justify-between h-12 border-b border-dark-200">
            <h3>Details</h3>
            <Button.Icon is_small onClick={close}>
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
                  value={form.title}
                  placeholder="Enter the title"
                  onChange={e =>
                     setForm(_form => ({ ..._form, title: e.target.value }))
                  }
               />
            </Styles.Fieldset>
            <Styles.Fieldset>
               <Styles.Label htmlFor="description">Description</Styles.Label>
               <Styles.TextArea
                  id="description"
                  name="description"
                  rows={5}
                  value={form.description}
                  placeholder="Enter the description"
                  onChange={e =>
                     setForm(_form => ({
                        ..._form,
                        description: e.target.value,
                     }))
                  }
               />
            </Styles.Fieldset>
         </main>
         <footer tw="flex items-center justify-between gap-3 px-3 mt-4">
            <main tw="flex items-center gap-3">
               <Button.Text variant="outline" onClick={close}>
                  Cancel
               </Button.Text>
               <Button.Text
                  onClick={upsert}
                  is_disabled={!isFormValid}
                  variant={isFormValid ? 'success' : 'primary'}
                  is_loading={updating_group || inserting_group}
               >
                  {formType === 'NEW' ? 'Save' : 'Update'}
               </Button.Text>
            </main>
            {formType === 'EDIT' && (
               <Button.Icon
                  variant="danger"
                  onClick={() =>
                     delete_group({
                        variables: { where: { id: { _eq: form.id } } },
                     })
                  }
               >
                  <Icon.Delete tw="stroke-current" />
               </Button.Icon>
            )}
         </footer>
      </div>
   )
}
