import React from 'react'
import App from 'next/app'
import { ToastProvider } from 'react-toast-notifications'
import '../global.css'
import 'tailwindcss/dist/base.min.css'

import fetch from 'node-fetch'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import { ConfigProvider, FormProvider } from '../context'

const authLink = setContext((_, { headers }) => {
   return {
      headers: {
         ...headers,
         'x-hasura-admin-secret': `${process.env.HASURA_KEY}`,
      },
   }
})

const wsLink = process.browser
   ? new WebSocketLink({
        uri: process.env.WS_GRAPHQL_ENDPOINT,
        options: {
           reconnect: true,
           connectionParams: {
              headers: {
                 'x-hasura-admin-secret': `${process.env.HASURA_KEY}`,
              },
           },
        },
     })
   : null

const httpLink = new HttpLink({
   fetch,
   uri: process.env.GRAPHQL_ENDPOINT,
})

const link = process.browser
   ? split(
        ({ query }) => {
           const { kind, operation } = getMainDefinition(query)
           return kind === 'OperationDefinition' && operation === 'subscription'
        },
        wsLink,
        authLink.concat(httpLink)
     )
   : authLink.concat(httpLink)

const client = new ApolloClient({
   link,
   cache: new InMemoryCache(),
})

class MyApp extends App {
   render() {
      const { Component, pageProps } = this.props
      return (
         <ToastProvider
            autoDismiss
            placement="top-center"
            autoDismissTimeout={4000}
         >
            <ApolloProvider client={client}>
               <ConfigProvider>
                  <FormProvider>
                     <Component {...pageProps} />
                  </FormProvider>
               </ConfigProvider>
            </ApolloProvider>
         </ToastProvider>
      )
   }
}

export default MyApp
