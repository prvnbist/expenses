import {
   split,
   ApolloClient,
   ApolloLink,
   InMemoryCache,
   createHttpLink,
   ApolloProvider,
} from '@apollo/client'
import fetch from 'node-fetch'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'

import '../styles/global.css'
import { ConfigProvider } from '../context'
import GlobalStyles from '../styles/global'

const wssLink = process.browser
   ? new WebSocketLink(
        new SubscriptionClient(`${process.env.WS_GRAPHQL_ENDPOINT}`, {
           reconnect: true,
           connectionParams: {
              headers: {
                 'x-hasura-admin-secret': `${process.env.HASURA_KEY}`,
              },
           },
        })
     )
   : null

const authLink = new ApolloLink((operation, forward) => {
   operation.setContext(({ headers }) => ({
      headers: {
         ...headers,
         'x-hasura-admin-secret': `${process.env.HASURA_KEY}`,
      },
   }))
   return forward(operation)
})

const httpLink = createHttpLink({
   fetch,
   uri: `${process.env.GRAPHQL_ENDPOINT}`,
})

const splitLink = process.browser
   ? split(
        ({ query }) => {
           const definition = getMainDefinition(query)
           return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
           )
        },
        wssLink,
        authLink.concat(httpLink)
     )
   : authLink.concat(httpLink)

const client = new ApolloClient({
   link: splitLink,
   cache: new InMemoryCache(),
})

const App = ({ Component, pageProps }) => {
   return (
      <ApolloProvider client={client}>
         <GlobalStyles />
         <ConfigProvider>
            <Component {...pageProps} />
         </ConfigProvider>
      </ApolloProvider>
   )
}

export default App
