import Link from 'next/link'
import tw from 'twin.macro'
import { useRouter } from 'next/router'

export const Tab = ({ children, href }) => {
   const router = useRouter()
   return (
      <Link href={href}>
         <a
            css={[
               tw`inline-block h-10 cursor-pointer focus:(outline-none bg-indigo-200 text-indigo-800) hover:(bg-indigo-100 text-indigo-600) rounded-lg py-2 px-3`,
               router.pathname === href
                  ? tw`bg-indigo-200 text-indigo-800`
                  : '',
            ]}
         >
            {children}
         </a>
      </Link>
   )
}
