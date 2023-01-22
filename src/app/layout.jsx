'use client'
import Link from 'next/link'
import { Inter } from '@next/font/google'
import { useCallback, useEffect, useState } from 'react'

import 'react-data-grid/lib/styles.css'

const inter = Inter({ subsets: ['latin'] })

import './globals.css'

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
         <body className={inter.className}>
            {status === 'LOADING' ? (
               <span>Loading...</span>
            ) : (
               <>
                  {isAuthorized ? (
                     <>
                        <header>
                           <Link href="/">Home</Link>
                           <Link href="/accounts">Accounts</Link>
                           <Link href="/categories">Categories</Link>
                           <Link href="/payment-methods">Payment Methods</Link>
                           <Link href="/groups">Groups</Link>
                        </header>
                        {children}
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
         </body>
      </html>
   )
}
