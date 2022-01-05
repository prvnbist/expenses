import Link from 'next/link'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'

import * as Icon from '../assets/icons'

const Header = () => {
   const router = useRouter()
   return (
      <Styles.Header>
         <Styles.NavItems>
            <Route
               path="/"
               title="Transactions"
               icon={<Icon.File tw="stroke-current" />}
               is_active={router.asPath === '/'}
            />
            <Route
               path="/accounts"
               title="Accounts"
               icon={<Icon.Dollar tw="stroke-current" />}
               is_active={router.asPath === '/accounts'}
            />
            <Route
               path="/reports"
               title="Reports"
               icon={<Icon.BarChart tw="stroke-current" />}
               is_active={router.asPath === '/reports'}
            />
            <Route
               path="/analytics"
               title="Analytics"
               icon={<Icon.LineChart tw="stroke-current" />}
               is_active={router.asPath === '/analytics'}
            />
         </Styles.NavItems>
      </Styles.Header>
   )
}

export default Header

const Route = ({ path, icon, title, is_active }) => (
   <li>
      <Link href={path}>
         <Styles.NavLink className={is_active ? 'active' : ''} title={title}>
            <span tw="h-8 w-8 md:(h-10 w-10) flex items-center justify-center">
               {icon}
            </span>
            <span tw="text-xs md:text-sm">{title}</span>
         </Styles.NavLink>
      </Link>
   </li>
)

const Styles = {
   Header: tw.header`bg-dark-400 z-10 sticky top-0 flex items-center justify-center h-auto border-b border-dark-200 md:(h-12)`,
   NavItems: styled.ul`
      ${tw`border-dark-200 mx-auto h-12 divide-x divide-gray-700 w-full grid grid-cols-4 md:(w-auto border-l border-r)`}
      li a {
         ${tw`border-b-0`}
      }
   `,
   NavLink: styled.a`
      ${tw`border-b border-dark-200 cursor-pointer flex items-center justify-center pr-4 h-12 hover:(bg-dark-200) flex-col md:flex-row`}
      &.active {
         ${tw`font-medium text-dark-400 bg-highlight hover:(bg-highlight-hover)`}
      }
      @media screen and (max-width: 567px) {
         ${tw`w-full px-0`}
      }
   `,
}
