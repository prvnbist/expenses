import gql from 'graphql-tag'

export const EXPENSES = gql`
   query expenses($limit: Int, $offset: Int) {
      expenses(
         limit: $limit
         offset: $offset
         order_by: { date: desc_nulls_last }
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
