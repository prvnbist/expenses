import { AppProps } from 'next/app'
import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@/styles/globals.css'

const queryClient = new QueryClient()

export default function App(props: AppProps) {
   const { Component, pageProps } = props

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
                  <Component {...pageProps} />
               </QueryClientProvider>
            </ModalsProvider>
         </MantineProvider>
      </>
   )
}
