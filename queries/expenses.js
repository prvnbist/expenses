import gql from 'graphql-tag'

export const EXPENSES = gql`
   query expenses(
      $limit: Int
      $offset: Int
      $where: expenses_bool_exp
      $order_by: [expenses_order_by!]
   ) {
      expenses(
         limit: $limit
         where: $where
         offset: $offset
         order_by: $order_by
      ) {
         id
         date
         title
         amount
         category
         payment_method
      }
   }
`
