import React from 'react'
import App from 'next/app'
import '../global.css'
import fetch from 'node-fetch'
import { ApolloLink, concat } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({
   fetch: fetch,
   uri: process.env.GRAPHQL_ENDPOINT,
})

const middlewareLink = new ApolloLink((operation, forward) => {
   operation.setContext({
      headers: {
         'Content-Type': 'application/json',
         'x-hasura-admin-secret': process.env.HASURA_KEY,
      },
   })
   return forward(operation)
})

const client = new ApolloClient({
   link: concat(middlewareLink, httpLink),
   cache: new InMemoryCache(),
})

class MyApp extends App {
   render() {
      const { Component, pageProps } = this.props
      return (
         <ApolloProvider client={client}>
            <Component {...pageProps} />
         </ApolloProvider>
      )
   }
}

export default MyApp
