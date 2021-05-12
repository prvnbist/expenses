import Link from 'next/link'
import tw, { styled } from 'twin.macro'
import { useRouter } from 'next/router'

const Header = () => {
   const router = useRouter()
   return (
      <Styles.Header>
         <Styles.NavItems>
            <Route
               path="/"
               title="Transactions"
               is_active={router.asPath === '/'}
            />
            <Route
               path="/accounts"
               title="Accounts"
               is_active={router.asPath === '/accounts'}
            />
            <Route
               path="/reports"
               title="Reports"
               is_active={router.asPath === '/reports'}
            />
            <Route
               path="/analytics"
               title="Analytics"
               is_active={router.asPath === '/analytics'}
            />
         </Styles.NavItems>
      </Styles.Header>
   )
}

export default Header

const Route = ({ path, title, is_active }) => (
   <li>
      <Link href={path}>
         <Styles.NavLink className={is_active ? 'active' : ''}>
            {title}
         </Styles.NavLink>
      </Link>
   </li>
)

const Styles = {
   Header: tw.header`z-10 bg-gray-800 sticky top-0 flex items-center justify-center h-auto p-2 border-b border-gray-700`,
   NavItems: styled.ul`
      ${tw`mx-auto h-full gap-3 flex flex-wrap`}
      @media screen and (max-width: 567px) {
         ${tw`w-full grid grid-cols-2`}
      }
   `,
   NavLink: styled.a`
      ${tw`cursor-pointer flex items-center justify-center px-4 h-10 rounded-lg`}
      &.active {
         ${tw`bg-indigo-700`}
      }
      @media screen and (max-width: 567px) {
         ${tw`w-full px-0`}
      }
   `,
}
