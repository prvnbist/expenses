import React from 'react'
import Link from 'next/link'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'

import * as Icon from '../icons'

interface ILayout {
   children: React.ReactNode
}

const Layout = ({ children }: ILayout): JSX.Element => {
   const router = useRouter()
   const [isCollapsed, setIsCollapsed] = React.useState(false)

   const routes = React.useMemo(
      () => [
         {
            icon: <Icon.File tw="stroke-current" />,
            title: 'Transactions',
            href: '/prvnbist/transactions',
            isActive: router.asPath.includes('transactions'),
         },
      ],
      [router.asPath]
   )
   return (
      <Styles.Layout>
         <Styles.Sidebar is_collapsed={isCollapsed}>
            <Styles.Items is_collapsed={isCollapsed}>
               {routes.map(route => (
                  <Styles.Item
                     key={route.href}
                     is_collapsed={isCollapsed}
                     is_active={route.isActive}
                  >
                     <Link href={route.href}>
                        <a title={route.title}>
                           <span>{route.icon}</span> <h4>{route.title}</h4>
                        </a>
                     </Link>
                  </Styles.Item>
               ))}
            </Styles.Items>
            <Styles.Collapse is_collapsed={isCollapsed}>
               <button
                  title="Collapse Sidebar"
                  onClick={() => setIsCollapsed(v => !v)}
               >
                  <Icon.Menu tw="stroke-current" />
               </button>
            </Styles.Collapse>
         </Styles.Sidebar>
         <main>{children}</main>
      </Styles.Layout>
   )
}

export default Layout

const Styles = {
   Layout: styled.div({
      ...tw`flex h-screen`,
   }),
   Sidebar: styled.aside({
      ...tw`flex flex-col bg-gray-100 border-r border-gray-200`,
      width: '240px',
      variants: {
         is_collapsed: {
            true: {
               ...tw`w-14`,
               '@tablet': {
                  ...tw`w-full h-auto max-h-[240px]`,
               },
            },
         },
      },
      '@tablet': {
         ...tw`w-full fixed bottom-0 flex h-10`,
      },
   }),
   Items: styled.ul({
      ...tw`px-2 flex flex-col gap-1 pt-2 overflow-y-auto`,
      variants: {
         is_collapsed: {
            true: {
               '@tablet': {
                  ...tw`px-2 py-2`,
               },
            },
         },
      },
      '@tablet': {
         ...tw`p-0`,
      },
   }),
   Item: styled.li({
      a: {
         ...tw`flex items-center rounded-md h-10 text-gray-700 hover:bg-gray-200`,
         span: {
            ...tw`h-full w-10 flex items-center justify-center`,
         },
      },
      variants: {
         is_collapsed: {
            true: {
               a: {
                  h4: {
                     ...tw`hidden`,
                     '@tablet': {
                        ...tw`block`,
                     },
                  },
               },
            },
         },
         is_active: {
            true: {
               a: {
                  ...tw`font-medium border-indigo-200 border-b-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100`,
               },
            },
         },
      },
   }),
   Collapse: styled.span({
      ...tw`flex-shrink-0 mt-auto w-full h-10 px-1 pb-1`,
      button: {
         ...tw`rounded w-full h-full flex items-center justify-center text-gray-700 hover:bg-gray-300`,
         '@tablet': {
            ...tw`rounded-none`,
         },
      },
      '@tablet': {
         ...tw`p-0 mt-[unset]`,
      },
      variants: {
         is_collapsed: {
            true: {
               '@tablet': {
                  ...tw`mt-auto`,
               },
            },
         },
      },
   }),
}
