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
      DELETE: gql`
         mutation delete_transaction($id: uuid = "") {
            delete_transaction(id: $id) {
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
   SUB_CATEGORIES: {
      CREATE: gql`
         mutation insert_sub_category(
            $object: sub_categories_insert_input = {}
         ) {
            insert_sub_category(object: $object) {
               id
            }
         }
      `,
      UPDATE: gql`
         mutation update_sub_category(
            $id: uuid = ""
            $_set: sub_categories_set_input = {}
         ) {
            update_sub_category(pk_columns: { id: $id }, _set: $_set) {
               id
            }
         }
      `,
   },
}
