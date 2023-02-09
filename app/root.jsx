import { json } from '@remix-run/node'
import {
   Links,
   Meta,
   Outlet,
   Scripts,
   LiveReload,
   useNavigate,
   useLoaderData,
   ScrollRestoration,
} from '@remix-run/react'

import { Navbar } from '~/components'
import styles from '~/styles/global.css'
import { GlobalProvider } from '~/state'

export const meta = () => ({
   charset: 'utf-8',
   title: 'Kharcha App',
   viewport: 'width=device-width,initial-scale=1',
})

export async function loader() {
   return json({
      ENV: {
         PASSWORD: process.env.PASSWORD,
      },
   })
}

export function links() {
   return [{ rel: 'stylesheet', href: styles }]
}

export default function App() {
   const data = useLoaderData()

   return (
      <html lang="en">
         <head>
            <Meta />
            <Links />
         </head>
         <body>
            <GlobalProvider {...data}>
               <Navbar />
               <Outlet />
               <ScrollRestoration />
               <Scripts />
               <LiveReload />
            </GlobalProvider>
         </body>
      </html>
   )
}
