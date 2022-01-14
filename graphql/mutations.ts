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
   },
}
