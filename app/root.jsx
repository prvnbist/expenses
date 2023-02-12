import { json } from '@remix-run/node'
import {
   Links,
   Meta,
   Outlet,
   Scripts,
   LiveReload,
   useNavigate,
   useLocation,
   useLoaderData,
   ScrollRestoration,
} from '@remix-run/react'

import { Navbar } from '~/components'
import styles from '~/styles/global.css'
import { GlobalProvider } from '~/state'
import reactDataGridStyles from 'react-data-grid/lib/styles.css'

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
   return [
      { rel: 'stylesheet', href: styles },
      { rel: 'stylesheet', href: reactDataGridStyles },
   ]
}

export default function App() {
   const data = useLoaderData()
   const location = useLocation()

   return (
      <html lang="en">
         <head>
            <Meta />
            <Links />
         </head>
         <body>
            <GlobalProvider {...data}>
               {location.pathname !== '/login' && <Navbar />}
               <main className="page__content">
                  <Outlet />
               </main>
               <ScrollRestoration />
               <Scripts />
               <LiveReload />
            </GlobalProvider>
            <div id="modal" />
         </body>
      </html>
   )
}
