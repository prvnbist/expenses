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
      DELETE: gql`
         mutation delete_category($id: uuid = "") {
            delete_category(id: $id) {
               id
            }
         }
      `,
   },
   ACCOUNTS: {
      CREATE: gql`
         mutation insert_account($object: accounts_insert_input = {}) {
            insert_account(object: $object) {
               id
            }
         }
      `,
      UPDATE: gql`
         mutation update_account(
            $id: uuid = ""
            $_set: accounts_set_input = {}
         ) {
            update_account(pk_columns: { id: $id }, _set: $_set) {
               id
            }
         }
      `,
      DELETE: gql`
         mutation delete_account($id: uuid = "") {
            delete_account(id: $id) {
               id
            }
         }
      `,
   },
   GROUPS: {
      CREATE: gql`
         mutation insert_group($object: groups_insert_input = {}) {
            insert_group(object: $object) {
               id
            }
         }
      `,
      UPDATE: gql`
         mutation update_group($id: uuid = "", $_set: groups_set_input = {}) {
            update_group(pk_columns: { id: $id }, _set: $_set) {
               id
            }
         }
      `,
      DELETE: gql`
         mutation delete_group($id: uuid = "") {
            delete_group(id: $id) {
               id
            }
         }
      `,
   },
   USER: {
      UPSERT: gql`
         mutation insert_user($object: user_insert_input = {}) {
            insert_user(
               object: $object
               on_conflict: {
                  constraint: user_email_key
                  update_columns: [email]
               }
            ) {
               id
               name
               email
               username
               profile_picture
            }
         }
      `,
   },
   PAYMENT_METHODS: {
      CREATE: gql`
         mutation insert_payment_method(
            $object: settings_payment_method_insert_input = {}
         ) {
            insert_payment_method: insert_settings_payment_method_one(
               object: $object
            ) {
               id
               title
            }
         }
      `,
      UPDATE: gql`
         mutation update_payment_method(
            $id: uuid = ""
            $_set: settings_payment_method_set_input = {}
         ) {
            update_payment_method: update_settings_payment_method_by_pk(
               pk_columns: { id: $id }
               _set: $_set
            ) {
               id
               title
            }
         }
      `,
      DELETE: gql`
         mutation delete_payment_method($id: uuid = "") {
            delete_payment_method: delete_settings_payment_method_by_pk(
               id: $id
            ) {
               id
               title
            }
         }
      `,
   },
}
