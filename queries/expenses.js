import gql from 'graphql-tag'

export const EXPENSES = gql`
   query expenses {
      expenses(order_by: { date: desc_nulls_last, id: desc }) {
         id
         date
         title
         amount
         category
         description
         payment_method
      }
   }
`
