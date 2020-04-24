import gql from 'graphql-tag'

export const PAYMENT_METHODS = gql`
   query payment_methods {
      payment_methods {
         title
      }
   }
`
