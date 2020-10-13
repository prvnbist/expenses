import React from 'react'
import tw, { css } from 'twin.macro'
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
   constructor(props) {
      super(props)
      this.state = {
         code: '',
         error: null,
         storeLocally: false,
         isAuthenticated: false,
      }
   }

   componentDidMount() {
      const access_code = localStorage.getItem('access_code')
      if (access_code === process.env.HASURA_KEY) {
         this.setState({ code: '', isAuthenticated: true })
      }
   }

   verifyCode = () => {
      if (this.state.code === process.env.HASURA_KEY) {
         this.setState({ code: '', isAuthenticated: true })
         if (this.state.storeLocally) {
            localStorage.setItem('access_code', this.state.code)
         }
      } else {
         this.setState({ error: 'Incorrect code, please try again!' })
      }
   }

   render() {
      const { Component, pageProps } = this.props
      if (!this.state.isAuthenticated) {
         return (
            <div tw="h-screen bg-gray-100 flex items-center justify-center">
               <section tw="flex flex-col bg-white border p-3 rounded">
                  <h2 tw="text-center text-gray-800 text-xl mb-3">
                     Authentication
                  </h2>
                  <input
                     type="password"
                     value={this.state.value}
                     placeholder="Enter the secret code"
                     tw="h-10 rounded px-3 bg-gray-200"
                     onChange={e =>
                        this.setState({ error: null, code: e.target.value })
                     }
                  />
                  {this.state.error && (
                     <span tw="text-red-600">{this.state.error}</span>
                  )}
                  <button
                     onClick={() => this.verifyCode()}
                     disabled={this.state.code.length === 0}
                     css={[
                        tw`mt-2 px-3 h-10 rounded text-white uppercase tracking-wider`,
                        this.state.code.length > 0
                           ? tw`bg-teal-600`
                           : tw`bg-teal-300 cursor-not-allowed`,
                     ]}
                  >
                     Submit
                  </button>
                  <fieldset tw="mt-2">
                     <input
                        tw="mr-2"
                        type="checkbox"
                        id="store_locally"
                        name="store_locally"
                        checked={this.state.storeLocally}
                        onChange={() =>
                           this.setState({
                              storeLocally: !this.state.storeLocally,
                           })
                        }
                     />
                     <label htmlFor="store_locally">Login automatically?</label>
                  </fieldset>
               </section>
            </div>
         )
      }
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
