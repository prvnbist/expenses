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

export const UPDATE_SETTING = gql`
   mutation update_settings(
      $type: String_comparison_exp!
      $_set: settings_set_input!
   ) {
      update_settings(where: { type: $type }, _set: $_set) {
         affected_rows
      }
   }
`

export const UPDATE_EXPENSE = gql`
   mutation updateExpense($id: uuid!, $_set: expenses_set_input!) {
      updateExpense: update_expenses_by_pk(
         pk_columns: { id: $id }
         _set: $_set
      ) {
         id
      }
   }
`

export const UPDATE_EARNING = gql`
   mutation updateEarning($id: uuid!, $_set: earnings_set_input!) {
      updateEarning: update_earnings_by_pk(
         pk_columns: { id: $id }
         _set: $_set
      ) {
         id
      }
   }
`
