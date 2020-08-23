import Link from 'next/link'
import { useRouter } from 'next/router'

export const Tab = ({ children, href }) => {
   const router = useRouter()
   return (
      <Link href={href}>
         <a
            className={`inline-block h-10 focus:outline-none rounded-lg focus:bg-indigo-200 focus:text-indigo-800 py-2 px-3 ${
               router.pathname === href ? 'bg-indigo-200 text-indigo-800' : ''
            }`}
         >
            {children}
         </a>
      </Link>
   )
}
