import tw from 'twin.macro'
import Link from 'next/link'
import Head from 'next/head'

import * as Icon from 'icons'
import Layout from 'sections/layout'
import { Listing } from './components'

export default function Groups() {
   return (
      <Layout>
         <Head>
            <title>Groups</title>
         </Head>
         <header tw="px-4 pt-4 flex items-center space-x-3">
            <h1
               data-test="page-title"
               tw="font-heading text-3xl font-medium text-gray-400"
            >
               Groups
            </h1>
            <Link href={`/groups/create`} passHref>
               <a
                  title="Create Group"
                  data-test="create-group"
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
