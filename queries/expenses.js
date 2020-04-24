import gql from 'graphql-tag'

export const EXPENSES = gql`
   query expenses($limit: Int, $offset: Int, $order_by: [expenses_order_by!]) {
      expenses(limit: $limit, offset: $offset, order_by: $order_by) {
         id
         date
         title
         amount
         category
         payment_method
      }
   }
`
