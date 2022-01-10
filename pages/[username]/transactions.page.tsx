import tw from 'twin.macro'
import { styled } from '@stitches/react'

import { Listing } from './components'
import useAuth from '../../hooks/useAuth'
import Layout from '../../sections/layout'

export default function Dashboard() {
   const { user, loading } = useAuth()
   return (
      <Layout is_loading={loading}>
         <Styles.Header>
            <h1>Transactions</h1>
         </Styles.Header>
         <Listing user={user} />
      </Layout>
   )
}

const Styles = {
   Header: styled('header', {
      ...tw`px-4 pt-4`,
      h1: {
         ...tw`font-heading text-3xl font-medium text-gray-700`,
      },
   }),
}
