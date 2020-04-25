import gql from 'graphql-tag'

export const EARNINGS = gql`
   query expenses(
      $limit: Int
      $offset: Int
      $where: earnings_bool_exp
      $order_by: [earnings_order_by!]
   ) {
      earnings(
         limit: $limit
         where: $where
         offset: $offset
         order_by: $order_by
      ) {
         id
         date
         amount
         source
         category
      }
   }
`
