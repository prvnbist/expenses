import tw from 'twin.macro'
import Link from 'next/link'

import { Listing } from './components'
import * as Icon from '../../../icons'
import { useUser } from '../../../lib/user'
import Layout from '../../../sections/layout'

export default function Categories() {
   const { user } = useUser()
   return (
      <Layout>
         <header tw="px-4 pt-4 flex items-center space-x-3">
            <h1 tw="font-heading text-3xl font-medium text-gray-400">
               Accounts
            </h1>
            <Link href={`/${user.username}/accounts/create`} passHref>
               <a
                  title="Create Account"
                  tw="cursor-pointer h-10 w-10 border border-dark-200 flex items-center justify-center hover:bg-dark-300"
               >
                  <Icon.Add tw="stroke-current text-white" />
               </a>
            </Link>
         </header>
         <Listing />
      </Layout>
   )
}
