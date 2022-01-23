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
            isActive: router.asPath.endsWith('transactions'),
         },
         {
            icon: <Icon.Account tw="stroke-current" />,
            title: 'Accounts',
            href: '/prvnbist/accounts',
            isActive: router.asPath.endsWith('accounts'),
         },
         {
            icon: <Icon.Group tw="stroke-current" />,
            title: 'Groups',
            href: '/prvnbist/groups',
            isActive: router.asPath.endsWith('groups'),
         },
         {
            id: 'settings',
            type: 'divider',
            title: 'Settings',
         },
         {
            title: 'Categories',
            href: '/prvnbist/settings/categories',
            icon: <Icon.Tag tw="stroke-current" />,
            isActive: router.asPath.endsWith('categories'),
         },
      ],
      [router.asPath]
   )
   return (
      <Styles.Layout>
         <Styles.Sidebar is_collapsed={isCollapsed}>
            <Styles.Items is_collapsed={isCollapsed}>
               {routes.map(route =>
                  route.type === 'divider' ? (
                     <Styles.Divider key={route.id} is_collapsed={isCollapsed}>
                        <span>{route.title}</span>
                     </Styles.Divider>
                  ) : (
                     <Styles.Item
                        key={route.href}
                        is_collapsed={isCollapsed}
                        is_active={route.isActive}
                     >
                        <Link href={route.href || ''}>
                           <a title={route.title}>
                              <span>{route.icon}</span> <h4>{route.title}</h4>
                           </a>
                        </Link>
                     </Styles.Item>
                  )
               )}
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
         <Styles.Main>{children}</Styles.Main>
      </Styles.Layout>
   )
}

export default Layout

const Styles = {
   Layout: styled.div({
      ...tw`flex h-screen`,
   }),
   Sidebar: styled.aside({
      ...tw`z-10 flex flex-col bg-dark-300 border-r border-dark-200`,
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
         ...tw`flex items-center rounded h-10 text-gray-400 hover:(text-white bg-dark-200)`,
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
                  ...tw`font-medium border-gray-600 border-b-2 text-indigo-400 bg-gray-700 hover:(text-indigo-400 bg-gray-700)`,
               },
            },
         },
      },
   }),
   Collapse: styled.span({
      ...tw`flex-shrink-0 mt-auto w-full h-10 px-1 pb-1`,
      button: {
         ...tw`rounded w-full h-full flex items-center justify-center text-white hover:bg-dark-200`,
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
   Main: styled('main', {
      ...tw`bg-dark-400 flex-1 overflow-y-auto`,
      '@tablet': { ...tw`h-[calc(100vh - 40px)]` },
   }),
   Divider: styled('li', {
      ...tw`pl-3 text-gray-400 mt-4`,
      variants: {
         is_collapsed: {
            true: {
               ...tw`border-b border-gray-500 mb-2`,
               span: { ...tw`hidden` },
            },
         },
      },
   }),
}
