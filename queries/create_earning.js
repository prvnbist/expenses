import gql from 'graphql-tag'

export const CREATE_EARNING = gql`
   mutation insert_earnings(
      $source: String
      $amount: float8
      $date: timestamp
      $category: String
   ) {
      insert_earnings(
         objects: {
            date: $date
            source: $source
            amount: $amount
            category: $category
         }
      ) {
         returning {
            id
            date
            amount
            source
            category
         }
      }
   }
`
