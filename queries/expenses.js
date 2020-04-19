import gql from 'graphql-tag'

export const EXPENSES = gql`
   query expenses {
      expenses(order_by: { date: desc_nulls_last }) {
         id
         date
         title
         amount
         category
         payment_method
      }
   }
`
