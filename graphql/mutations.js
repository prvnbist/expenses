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

export const DELETE_EARNINGS = gql`
   mutation delete_earnings($where: earnings_bool_exp!) {
      delete_earnings(where: $where) {
         returning {
            id
            source
         }
      }
   }
`

export const DELETE_EXPENSES = gql`
   mutation delete_expenses($where: expenses_bool_exp!) {
      delete_expenses(where: $where) {
         returning {
            id
            title
         }
      }
   }
`
