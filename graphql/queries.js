import { gql } from '@apollo/client'

export const SETTINGS = gql`
   subscription settings {
      settings {
         id
         type
         value
      }
   }
`

export const TRANSACTIONS = gql`
   subscription transactions {
      transactions(order_by: { date: desc, title: asc }) {
         id
         date
         type
         title
         amount
         category {
            id
            title
         }
         payment_method {
            id
            title
         }
      }
   }
`
