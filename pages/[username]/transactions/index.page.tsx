import tw from 'twin.macro'
import { styled } from '@stitches/react'

import { Listing } from './components'
import Layout from '../../../sections/layout'

export default function Dashboard() {
   return (
      <Layout>
         <Styles.Header>
            <h1>Transactions</h1>
         </Styles.Header>
         <Listing />
      </Layout>
   )
}

const Styles = {
   Header: styled('header', {
      ...tw`px-4 pt-4`,
      h1: {
         ...tw`font-heading text-3xl font-medium text-gray-400`,
      },
   }),
}
