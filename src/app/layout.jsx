'use client'
import Link from 'next/link'
import { ToastProvider } from 'react-toast-notifications'
import { useCallback, useEffect, useState } from 'react'

import 'react-data-grid/lib/styles.css'

import './globals.css'

const activeLinkStyle = `block py-2 pl-3 pr-4 text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:p-0 dark:text-white`
const linkStyle = `block py-2 pl-3 pr-4 md:hover:bg-transparent md:p-0 text-[var(--dark-50)] hover:text-white hover:bg-[var(--dark-100)] md:hover:bg-transparent`

export default function RootLayout({ children }) {
   const [error, setError] = useState('')
   const [password, setPassword] = useState('')
   const [status, setStatus] = useState('LOADING')
   const [isAuthorized, setIsAuthorized] = useState(false)

   useEffect(() => {
      try {
         setStatus('LOADING')
         const item = window.localStorage.getItem('storedPW')
         if (item && JSON.parse(item) === process.env.PASSWORD) {
            setIsAuthorized(true)
            setStatus('SUCCESS')
            return
         }

         setStatus('IDLE')
      } catch (error) {
         setError(error)
      }
   }, [])

   const logIn = useCallback(() => {
      setError('')

      const _password = password.trim()
      if (!_password) {
         setError('Enter the password to log in!')
         return
      }

      if (_password !== process.env.PASSWORD) {
         setError('Incorrect Password')
         return
      }

      setError('')
      setIsAuthorized(true)
      window.localStorage.setItem('storedPW', JSON.stringify(_password))
   }, [password])

   return (
      <html lang="en">
         <head />
         <body>
            <ToastProvider autoDismiss placement="top-center" autoDismissTimeout={3000}>
               {status === 'LOADING' ? (
                  <span>Loading...</span>
               ) : (
                  <>
                     {isAuthorized ? (
                        <>
                           <Navbar />
                           <main className="p-6">{children}</main>
                        </>
                     ) : (
                        <div>
                           <fieldset>
                              <label htmlFor="password">Password</label>
                              <input
                                 id="password"
                                 type="password"
                                 name="password"
                                 value={password}
                                 placeholder="Enter the password"
                                 onChange={e => setPassword(e.target.value)}
                              />
                           </fieldset>
                           <button onClick={logIn}>Log In</button>
                           {error && <span>{error}</span>}
                        </div>
                     )}
                  </>
               )}
            </ToastProvider>
         </body>
      </html>
   )
}

const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false)
   return (
      <nav
         className={`px-6 border-b border-[var(--dark-200)] bg-[var(--dark-300)]  ${isOpen ? 'pt-2.5 pb-6' : 'py-2.5'}`}
      >
         <div className="flex flex-wrap items-center justify-between mx-auto">
            <Link href="/" className="self-center text-xl font-semibold whitespace-nowrap text-white">
               Kharcha
            </Link>
            <button
               type="button"
               onClick={() => setIsOpen(v => !v)}
               className="inline-flex items-center p-2 ml-3 text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-white hover:bg-[var(--dark-200)] focus:ring-gray-600"
            >
               <span className="sr-only">Open main menu</span>
               <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="#fff"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     fillRule="evenodd"
                     d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                     clipRule="evenodd"
                  ></path>
               </svg>
            </button>
            <div className={`w-full md:block md:w-auto ${isOpen ? '' : 'hidden'}`}>
               <ul
                  className={`overflow-hidden flex flex-col mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:bg-transparent bg-[var(--dark-200)]`}
               >
                  <li>
                     <Link href="/" className={linkStyle}>
                        Home
                     </Link>
                  </li>
                  <li>
                     <Link href="/accounts" className={linkStyle}>
                        Accounts
                     </Link>
                  </li>
                  <li>
                     <Link href="/categories" className={linkStyle}>
                        Categories
                     </Link>
                  </li>
                  <li>
                     <Link href="/payment-methods" className={linkStyle}>
                        Payment Methods
                     </Link>
                  </li>
                  <li>
                     <Link href="/groups" className={linkStyle}>
                        Groups
                     </Link>
                  </li>
               </ul>
            </div>
         </div>
      </nav>
   )
}
