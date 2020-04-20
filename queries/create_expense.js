import gql from 'graphql-tag'

export const CREATE_EXPENSE = gql`
   mutation create_expenses(
      $title: String
      $amount: float8
      $date: timestamp
      $category: String
      $payment_method: String
   ) {
      create_expenses(
         objects: {
            date: $date
            title: $title
            amount: $amount
            category: $category
            payment_method: $payment_method
         }
      ) {
         returning {
            id
            date
            title
            amount
            category
            payment_method
         }
      }
   }
`
