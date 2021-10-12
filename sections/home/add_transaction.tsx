import React from 'react'
import tw from 'twin.macro'

import { Form } from './form'
import { Button } from '../../components'
import * as Icon from '../../assets/icons'
import { useTransactions } from '../../hooks'

export const AddTransaction = (): JSX.Element => {
   const { setEditForm, isFormOpen, setIsFormOpen } = useTransactions()

   const close = () => {
      setEditForm({})
      setIsFormOpen(!isFormOpen)
   }

   if (!isFormOpen) return null
   return (
      <section tw="overflow-y-auto pb-3 fixed left-0 top-0 bottom-0 z-10 bg-gray-800 shadow-xl w-full md:w-6/12 lg:w-5/12 xl:w-4/12">
         <header tw="sticky top-0 flex items-center justify-between px-3 h-16 bg-gray-800 border-b border-gray-700">
            <h1 tw="text-xl">Add Transactions</h1>
            <Button.Icon onClick={close}>
               <Icon.Close tw="stroke-current" />
            </Button.Icon>
         </header>
         <main tw="px-3">
            <Form />
         </main>
      </section>
   )
}
