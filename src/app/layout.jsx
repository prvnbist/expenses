import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

import './globals.css'

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <head />
         <body className={inter.className}>{children}</body>
      </html>
   )
}
