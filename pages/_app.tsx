import { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { useLocalStorage } from '@mantine/hooks'
import { Notifications } from '@mantine/notifications'

import '@/styles/globals.css'
import { GlobalProvider } from '@/state'

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
      },
   },
})

export default function App(props: AppProps) {
   const { Component, pageProps } = props

   const router = useRouter()
   const [value] = useLocalStorage({ key: 'password', defaultValue: '', getInitialValueInEffect: false })

   useEffect(() => {
      if (router.pathname === '/login') {
         if (value?.trim() === process.env.APP_PASSWORD) {
            router.push('/')
         }
      } else if (value?.trim() !== process.env.APP_PASSWORD) {
         router.push('/login')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [value])

   return (
      <>
         <Head>
            <title>Expenses</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
         </Head>

         <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
               /** Put your mantine theme override here */
               colorScheme: 'dark',
            }}
         >
            <Notifications />
            <ModalsProvider>
               <QueryClientProvider client={queryClient}>
                  <GlobalProvider>
                     <Component {...pageProps} />
                  </GlobalProvider>
               </QueryClientProvider>
            </ModalsProvider>
         </MantineProvider>
      </>
   )
}
