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
                  sub_category
                  sub_category_id
                  account
                  account_id
                  group
                  group_id
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
         query transactions_views($where: transactions_view_bool_exp = {}) {
            transactions_views(where: $where) {
               id
               type
               date
               title
               amount
               user_id
               raw_date
               account
               account_id
               category
               sub_category
               sub_category_id
               group
               group_id
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
         query category(
            $userid: uuid!
            $id: uuid = ""
            $where: sub_categories_bool_exp = {}
         ) {
            category(id: $id) {
               id
               title
               user_id
               sub_categories(order_by: { title: asc }, where: $where) {
                  id
                  title
                  user_id
                  transactions_count(args: { userid: $userid })
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
      ONE: gql`
         query sub_category($id: uuid = "") {
            sub_category(id: $id) {
               id
               title
               user_id
            }
         }
      `,
   },
   ACCOUNTS: {
      LIST: gql`
         query accounts($userid: uuid = "", $where: accounts_bool_exp = {}) {
            accounts: accounts_aggregate(
               where: $where
               order_by: { title: asc }
            ) {
               aggregate {
                  count
               }
               nodes {
                  id
                  title
                  amount
                  user_id
                  transactions_count(args: { userid: $userid })
               }
            }
         }
      `,
      ONE: gql`
         query account($id: uuid = "") {
            account(id: $id) {
               id
               title
               amount
               user_id
            }
         }
      `,
   },
   GROUPS: {
      LIST: gql`
         query groups($userid: uuid = "", $where: groups_bool_exp = {}) {
            groups: groups_aggregate(where: $where, order_by: { title: asc }) {
               aggregate {
                  count
               }
               nodes {
                  id
                  title
                  description
                  user_id
                  transactions_count(args: { userid: $userid })
               }
            }
         }
      `,
      ONE: gql`
         query group($id: uuid = "") {
            group(id: $id) {
               id
               title
               user_id
               description
            }
         }
      `,
   },
}

export default QUERIES
