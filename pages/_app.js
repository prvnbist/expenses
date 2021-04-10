import {
   split,
   ApolloClient,
   ApolloLink,
   InMemoryCache,
   createHttpLink,
   ApolloProvider,
} from '@apollo/client'
import tw from 'twin.macro'
import fetch from 'node-fetch'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'

import '../styles/global.css'
import { Button } from '../components'
import { ConfigProvider } from '../context'
import GlobalStyles from '../styles/global'
import { TransactionsProvider } from '../hooks/useTransactions'

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
   const [isAuthenticating, setIsAuthenticating] = React.useState(true)
   const [authenticated, setAuthenticated] = React.useState(false)

   React.useEffect(() => {
      const secret = localStorage.getItem('secret')
      if (secret && secret === process.env.HASURA_KEY) {
         setAuthenticated(true)
      }
      setIsAuthenticating(false)
   }, [])

   if (isAuthenticating) return null
   return (
      <ApolloProvider client={client}>
         <GlobalStyles />
         <ConfigProvider>
            {authenticated ? (
               <TransactionsProvider>
                  <Component {...pageProps} />
               </TransactionsProvider>
            ) : (
               <Login setAuthenticated={setAuthenticated} />
            )}
         </ConfigProvider>
      </ApolloProvider>
   )
}

export default App

const Login = ({ setAuthenticated }) => {
   const [key, setKey] = React.useState('')
   const [saveKey, setSaveKey] = React.useState(false)
   const [error, setError] = React.useState('')

   const onSubmit = () => {
      if (!process.browser) return

      if (process.env.HASURA_KEY === key) {
         saveKey && localStorage.setItem('secret', key)
         setAuthenticated(true)
      } else {
         setError('Incorrect key provided!')
      }
   }
   return (
      <div tw="flex items-center justify-center h-screen">
         <section tw="bg-gray-900 py-3 px-4 rounded">
            <fieldset tw="flex flex-col space-y-1 mt-2 flex-1">
               <label
                  htmlFor="key"
                  tw="text-sm text-gray-500 uppercase font-medium tracking-wider"
               >
                  Key
               </label>
               <input
                  value={key}
                  type="password"
                  placeholder="Enter the key"
                  tw="bg-gray-700 h-10 rounded px-2"
                  onChange={e => setKey(e.target.value)}
               />
            </fieldset>
            <fieldset tw="my-3">
               <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  value={saveKey}
                  onChange={() => setSaveKey(!saveKey)}
               />
               <label htmlFor="remember" tw="ml-2 text-gray-500 ">
                  Remember in this browser
               </label>
            </fieldset>
            <Button.Text tw="w-full" onClick={onSubmit}>
               Submit
            </Button.Text>
            <span tw="block pt-3 text-red-500">{error}</span>
         </section>
      </div>
   )
}
