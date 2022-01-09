import { setContext } from '@apollo/client/link/context'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'

const httpLink = createHttpLink({
   uri: process.env.NEXT_HASURA_ENDPOINT,
})

const authLink = setContext((_, { headers }) => {
   return {
      headers: {
         ...headers,
         'x-hasura-admin-secret': process.env.NEXT_HASURA_ADMIN_SECRET || '',
      },
   }
})

const client = new ApolloClient({
   link: authLink.concat(httpLink),
   cache: new InMemoryCache(),
})

export default client
