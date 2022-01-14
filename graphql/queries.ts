import { gql } from '@apollo/client'

const QUERIES = {
   TRANSACTIONS: {
      LIST: gql`
         query transactions(
            $user_id: uuid!
            $offset: Int = 0
            $limit: Int = 10
            $where: transactions_view_bool_exp = {}
            $order_by: [transactions_view_order_by!] = {}
         ) {
            transactions: transactions_view_aggregate(
               where: $where
               order_by: $order_by
               offset: $offset
               limit: $limit
            ) {
               nodes {
                  id
                  title
                  type
                  date
                  amount
                  raw_date
               }
            }
            transactions_aggregate: transactions_view_aggregate(
               where: { user_id: { _eq: $user_id } }
            ) {
               aggregate {
                  count
                  sum {
                     debit
                     credit
                  }
               }
            }
         }
      `,
   },
   CATEGORIES: {
      LIST: gql`
         query categories($where: categories_bool_exp = {}) {
            categories: categories_aggregate(
               order_by: { title: asc }
               where: $where
            ) {
               aggregate {
                  count
               }
               nodes {
                  id
                  title
                  type
               }
            }
         }
      `,
   },
   SUB_CATEGORIES: {
      LIST: gql`
         query categories($where: sub_categories_bool_exp = {}) {
            categories: sub_categories_aggregate(
               order_by: { title: asc }
               where: $where
            ) {
               aggregate {
                  count
               }
               nodes {
                  id
                  title
               }
            }
         }
      `,
   },
}

export default QUERIES
