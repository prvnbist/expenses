import { gql } from '@apollo/client'

const QUERIES = {
   TRANSACTIONS: {
      LIST: gql`
         query transactions(
            $offset: Int = 0
            $limit: Int = 10
            $where: transactions_view_bool_exp = {}
            $where2: transactions_view_bool_exp = {}
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
                  category
                  category_id
               }
            }
            transactions_aggregate: transactions_view_aggregate(
               where: $where2
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
      ONE: gql`
         query transaction($id: uuid = "") {
            transaction(id: $id) {
               id
               type
               date
               title
               amount
               user_id
               category_id
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
                  user_id
               }
            }
         }
      `,
      ONE: gql`
         query category($id: uuid = "") {
            category(id: $id) {
               id
               title
               type
               user_id
            }
         }
      `,
      WITH_SUB_CATEGORIES: gql`
         query categories(
            $where: categories_bool_exp = {}
            $where1: sub_categories_bool_exp = {}
         ) {
            categories(order_by: { title: asc }, where: $where) {
               id
               title
               sub_categories(order_by: { title: asc }, where: $where1) {
                  id
                  title
               }
            }
         }
      `,
      ONE_WITH_SUB_CATEGORIES: gql`
         query category($where: sub_categories_bool_exp = {}, $id: uuid = "") {
            category(id: $id) {
               id
               title
               user_id
               sub_categories(order_by: { title: asc }, where: $where) {
                  id
                  title
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
