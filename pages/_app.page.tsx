import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'

import client from '../lib/apollo'
import globalStyles from '../styles/globalStyles'

import '../styles/globals.css'
import { UserProvider } from '../lib/user'

const App = ({ Component, pageProps }: AppProps) => {
   globalStyles()
   return (
      <ApolloProvider client={client}>
         <UserProvider>
            <Component {...pageProps} />
         </UserProvider>
      </ApolloProvider>
   )
}

export default App
