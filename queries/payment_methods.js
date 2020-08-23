import gql from 'graphql-tag'

export const PAYMENT_METHODS = gql`
   subscription payment_methods {
      payment_methods {
         title
      }
   }
`
