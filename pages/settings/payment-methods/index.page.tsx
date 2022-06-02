import React from 'react'
import tw from 'twin.macro'
import Modal from 'react-modal'
import { useRouter } from 'next/router'

import * as Icon from 'icons'
import Layout from 'sections/layout'
import { CreatePaymentMethod, Listing } from './components'

export default function PaymentMethods() {
   const router = useRouter()
   const [isModalOpen, setIsModalOpen] = React.useState(false)

   React.useEffect(() => {
      if (router.query.id) {
         setIsModalOpen(true)
      }
   }, [router.query])

   return (
      <Layout>
         <header tw="px-4 pt-4 flex items-center space-x-3">
            <h1 tw="font-heading text-3xl font-medium text-gray-400">
               Payment Methods
            </h1>
            <button
               title="Create Payment Method"
               onClick={() => setIsModalOpen(true)}
               tw="cursor-pointer h-10 w-10 border border-dark-200 flex items-center justify-center hover:bg-dark-300"
            >
               <Icon.Add tw="stroke-current text-white" />
            </button>
         </header>
         <Listing />
         <Modal
            isOpen={isModalOpen}
            contentLabel="Create Payment method"
            onRequestClose={() => setIsModalOpen(false)}
         >
            <CreatePaymentMethod
               closeModal={() => {
                  setIsModalOpen(false)
                  router.push('/settings/payment-methods')
               }}
            />
         </Modal>
      </Layout>
   )
}