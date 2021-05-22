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

export const DELETE_TRANSACTION = gql`
   mutation delete_transaction($id: uuid!) {
      delete_transaction: delete_transactions_by_pk(id: $id) {
         id
      }
   }
`

export const DELETE_TRANSACTIONS = gql`
   mutation delete_transactions($where: transactions_bool_exp!) {
      delete_transactions(where: $where) {
         affected_rows
      }
   }
`

export const UPSERT_ACCOUNT = gql`
   mutation upsert_account($objects: [accounts_insert_input!]!) {
      upsert_account: insert_accounts(
         objects: $objects
         on_conflict: {
            constraint: accounts_pkey
            update_columns: [title, balance]
         }
      ) {
         affected_rows
      }
   }
`

export const DELETE_ACCOUNT = gql`
   mutation delete_account($id: uuid!) {
      delete_account: delete_accounts_by_pk(id: $id) {
         id
      }
   }
`
