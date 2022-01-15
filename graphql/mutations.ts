import { gql } from '@apollo/client'

export const MUTATIONS = {
   TRANSACTIONS: {
      CREATE: gql`
         mutation insert_transaction($object: transactions_insert_input = {}) {
            insert_transaction(object: $object) {
               id
            }
         }
      `,
      UPDATE: gql`
         mutation update_transaction(
            $id: uuid = ""
            $_set: transactions_set_input = {}
         ) {
            update_transaction(pk_columns: { id: $id }, _set: $_set) {
               id
            }
         }
      `,
   },
   CATEGORIES: {
      CREATE: gql`
         mutation insert_category($object: categories_insert_input = {}) {
            insert_category(object: $object) {
               id
            }
         }
      `,
      UPDATE: gql`
         mutation update_category(
            $id: uuid = ""
            $_set: categories_set_input = {}
         ) {
            update_category(pk_columns: { id: $id }, _set: $_set) {
               id
            }
         }
      `,
   },
}