import gql from 'graphql-tag'

export const EARNINGS = gql`
   query earnings {
      earnings(order_by: { date: desc_nulls_last }) {
         id
         date
         amount
         source
         category
      }
   }
`
