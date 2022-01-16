import tw from 'twin.macro'

import { Listing } from './components'
import Layout from '../../../sections/layout'

export default function Categories() {
   return (
      <Layout>
         <header tw="px-4 pt-4 flex items-center space-x-3">
            <h1 tw="font-heading text-3xl font-medium text-gray-400">
               Accounts
            </h1>
         </header>
         <Listing />
      </Layout>
   )
}
