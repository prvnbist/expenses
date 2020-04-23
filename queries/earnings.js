import gql from 'graphql-tag'

export const EARNINGS = gql`
   query expenses($limit: Int, $offset: Int) {
      earnings(
         limit: $limit
         offset: $offset
         order_by: { date: desc_nulls_last }
      ) {
         id
         date
         amount
         source
         category
      }
   }
`
