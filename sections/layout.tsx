import React from 'react'
import Link from 'next/link'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'

import * as Icon from '../icons'
import { useUser } from '../lib/user'
import { auth } from '../lib/supabase'

interface ILayout {
   children: React.ReactNode
}

const Layout = ({ children }: ILayout): JSX.Element => {
   const router = useRouter()
   const { user } = useUser()
   const [isMenuOpen, setIsMenuOpen] = React.useState(false)

   const routes = React.useMemo(
      () => [
         {
            icon: <Icon.Dashboard tw="stroke-current" />,
            title: 'Dashboard',
            href: `/dashboard`,
            isActive: router.asPath.endsWith('dashboard'),
         },
         {
            icon: <Icon.File tw="stroke-current" />,
            title: 'Transactions',
            href: `/transactions`,
            isActive: router.asPath.endsWith('transactions'),
         },
         {
            icon: <Icon.DollarSign tw="stroke-current" />,
            title: 'Accounts',
            href: `/accounts`,
            isActive: router.asPath.endsWith('accounts'),
         },
         {
            icon: <Icon.Group tw="stroke-current" />,
            title: 'Groups',
            href: `/groups`,
            isActive: router.asPath.endsWith('groups'),
         },
         {
            title: 'Categories',
            href: `/settings/categories`,
            icon: <Icon.Tag tw="stroke-current" />,
            isActive: router.asPath.endsWith('categories'),
         },
         {
            title: 'Payment Methods',
            href: `/settings/payment-methods`,
            icon: <Icon.Account tw="stroke-current" />,
            isActive: router.asPath.endsWith('payment-methods'),
         },
      ],
      [router.asPath, user]
   )
   return (
      <Styles.Layout>
         <Styles.Menu
            isMenuOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(v => !v)}
         >
            <Icon.Menu tw="stroke-current text-white" />
         </Styles.Menu>
         <Styles.Navbar isMenuOpen={isMenuOpen}>
            <Styles.Items>
               {routes.map(route => (
                  <Styles.Item key={route.href} is_active={route.isActive}>
                     <Link href={route.href || ''}>
                        <a title={route.title}>
                           <span>{route.icon}</span> <h4>{route.title}</h4>
                        </a>
                     </Link>
                  </Styles.Item>
               ))}
            </Styles.Items>
            <Styles.Logout onClick={auth.signout}>Log Out</Styles.Logout>
         </Styles.Navbar>
         <Styles.Main>{children}</Styles.Main>
      </Styles.Layout>
   )
}

export default Layout

const Styles = {
   Layout: styled.div({
      ...tw`h-screen flex flex-col overflow-hidden relative`,
   }),
   Navbar: styled.nav({
      ...tw`z-10 flex items-center justify-between bg-dark-300 border-r border-dark-200`,
      '@tablet': {
         ...tw`hidden flex-col w-full fixed top-[40px]`,
      },
      variants: {
         isMenuOpen: {
            true: {
               '@tablet': {
                  ...tw`flex`,
               },
            },
         },
      },
   }),
   Items: styled.ul({
      ...tw`h-10 flex items-center`,
      '@tablet': {
         ...tw`w-full h-auto flex-col grid grid-cols-2`,
      },
   }),
   Item: styled.li({
      '@tablet': {
         ...tw`w-full`,
         a: {
            ...tw`justify-center`,
         },
      },
      a: {
         ...tw`text-sm pr-3 flex items-center h-10 text-gray-400 border-b-2 border-transparent hover:(text-white bg-black/10 border-indigo-400)`,
         span: {
            ...tw`h-full w-10 flex items-center justify-center`,
         },
      },
      variants: {
         is_active: {
            true: {
               a: {
                  ...tw`text-white border-b-2 border-indigo-400 bg-black/10 hover:(border-indigo-400 bg-black/10)`,
               },
            },
         },
      },
   }),
   Main: styled('main', {
      ...tw`bg-dark-400 flex-1 overflow-y-auto`,
      '@tablet': { ...tw`h-[calc(100vh - 40px)]` },
   }),
   Logout: styled.button({
      ...tw`mr-1 px-2 py-1 rounded text-red-400 border border-transparent hover:(border-red-400)`,
      '@tablet': {
         ...tw`mt-2 w-[calc(100% - 24px)] mb-2 mr-0`,
      },
   }),
   Menu: styled('button', {
      ...tw`hidden h-10 w-full bg-dark-300 items-center justify-center`,
      '@tablet': {
         ...tw`flex`,
      },
      variants: {
         isMenuOpen: {
            true: {
               ...tw`bg-dark-400`,
            },
         },
      },
   }),
}
