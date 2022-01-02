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
   Header: tw.header`z-10 sticky top-0 flex items-center justify-center h-auto border-b border-dark-200 md:(h-12)`,
   NavItems: styled.ul`
      ${tw`border-dark-200 mx-auto h-auto flex flex-wrap divide-x divide-gray-700 md:(border-l border-r h-12)`}
      @media screen and (max-width: 567px) {
         ${tw`w-full grid grid-cols-2`}
      }
      li {
         &:last-child a,
         &:nth-last-child(2) a {
            ${tw`border-b-0`}
         }
      }
   `,
   NavLink: styled.a`
      ${tw`border-b border-dark-200 cursor-pointer flex items-center justify-center px-4 h-10 hover:(bg-dark-200) md:(h-12)`}
      &.active {
         ${tw`font-medium text-dark-400 bg-highlight hover:(bg-highlight-hover)`}
      }
      @media screen and (max-width: 567px) {
         ${tw`w-full px-0`}
      }
   `,
}
