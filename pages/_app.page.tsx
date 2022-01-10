import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'

import client from '../lib/apollo'
import globalStyles from '../styles/globalStyles'

import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => {
   globalStyles()
   return (
      <ApolloProvider client={client}>
         <Component {...pageProps} />
      </ApolloProvider>
   )
}

export default App
