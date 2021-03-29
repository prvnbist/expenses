import { gql } from '@apollo/client'

export const INSERT_TRANSACTION = gql`
   mutation insert_transaction(
      $object: transactions_insert_input!
      $update_columns: [transactions_update_column!]!
   ) {
      insert_transaction: insert_transactions_one(
         object: $object
         on_conflict: {
            constraint: transactions_pkey
            update_columns: $update_columns
         }
      ) {
         id
      }
   }
`
