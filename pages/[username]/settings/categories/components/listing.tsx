import React from 'react'
import Link from 'next/link'
import tw, { styled } from 'twin.macro'
import { useQuery } from '@apollo/client'

import * as Icon from '../../../../../icons'
import { useUser } from '../../../../../lib/user'
import { Loader } from '../../../../../components'
import QUERIES from '../../../../../graphql/queries'

interface ICategory {
   id: string
   title: string
   user_id: string | null
   type: 'expense' | 'income'
   sub_categories: {
      aggregate: {
         count: number
      }
      nodes: ISubCategory[]
   }
}

interface ISubCategory {
   id: string
   title: string
}

const Listing = () => {
   const { user } = useUser()

   const {
      loading,
      error,
      data: { categories = {} } = {},
   } = useQuery(QUERIES.CATEGORIES.LIST, {
      skip: !user?.id,
      variables: {
         where: {
            _or: [
               { user_id: { _eq: user.id } },
               { user_id: { _is_null: true } },
            ],
         },
      },
   })

   if (loading) return <Loader />
   if (error) return <p>Something went wrong, please refresh the page.</p>
   if (categories.aggregate.count === 0)
      return <p tw="text-gray-400">Please start by creating a category.</p>
   return (
      <Styles.Categories>
         {categories.nodes.map((category: ICategory) => (
            <Styles.Category key={category.id}>
               <h2 tw="border-l border-indigo-500 border-l-2 py-3 px-3 mb-3 text-lg truncate">
                  <Link
                     href={`/${user.username}/settings/categories/${category.id}`}
                  >
                     <a tw="text-white hover:text-indigo-400 cursor-pointer">
                        {category.title}
                     </a>
                  </Link>
               </h2>
               {category.user_id === user.id && (
                  <footer tw="w-full justify-end mt-auto flex gap-3 px-3 border-t border-dark-200 pt-3">
                     <Link
                        href={`/${user.username}/settings/categories/create?id=${category.id}`}
                     >
                        <a tw="cursor-pointer border border-dark-200 h-8 w-8 flex items-center justify-center hover:bg-dark-300">
                           <Icon.Edit size={16} tw="fill-current text-white" />
                        </a>
                     </Link>
                  </footer>
               )}
            </Styles.Category>
         ))}
      </Styles.Categories>
   )
}

export default Listing

const Styles = {
   Categories: styled.ul({
      ...tw`grid p-3 mt-1`,
      gridGap: '16px',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
   }),
   Category: styled.li({
      ...tw`flex flex-col border border-dark-200 py-3`,
   }),
}
