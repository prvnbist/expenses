import Link from 'next/link'
import { Inter } from '@next/font/google'

import 'react-data-grid/lib/styles.css'

const inter = Inter({ subsets: ['latin'] })

import './globals.css'

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <head />
         <body className={inter.className}>
            <header>
               <Link href="/">Home</Link>
               <Link href="/accounts">Accounts</Link>
               <Link href="/categories">Categories</Link>
               <Link href="/payment-methods">Payment Methods</Link>
               <Link href="/groups">Groups</Link>
            </header>
            {children}
         </body>
      </html>
   )
}
