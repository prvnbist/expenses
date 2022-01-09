import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
   return (
      <>
         <Head>
            <script
               dangerouslySetInnerHTML={{
                  __html: `
          if (document.cookie && document.cookie.includes('authed')) {
            window.location.href = "/transactions"
          }
        `,
               }}
            />
         </Head>
         <Link href="/login">
            <a>Login</a>
         </Link>
      </>
   )
}
