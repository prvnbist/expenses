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
                  account
                  account_id
                  group
                  group_id
                  payment_method
                  payment_method_id
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
            transactions_view(where: $where) {
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
               category_id
               group
               group_id
               payment_method
               payment_method_id
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
   PAYMENT_METHODS: {
      LIST: gql`
         query payment_methods(
            $userid: uuid = ""
            $where: settings_payment_method_bool_exp = {}
         ) {
            payment_methods: payment_methods_aggregate(
               order_by: { title: asc }
               where: $where
            ) {
               aggregate {
                  count
               }
               nodes {
                  id
                  title
                  user_id
                  transactions_count(args: { userid: $userid })
               }
            }
         }
      `,
      ONE: gql`
         query payment_method($id: uuid = "") {
            payment_method(id: $id) {
               id
               title
               user_id
            }
         }
      `,
   },
   USERS: {
      LIST: gql`
         query users($where: user_bool_exp = {}) {
            users(where: $where) {
               id
               name
               email
               profile_picture
               username
            }
         }
      `,
   },
   SETTINGS: {
      LIST: gql`
         query settings($where: settings_bool_exp = {}) {
            settings(order_by: { title: asc }, where: $where) {
               title
               value
            }
         }
      `,
   },
}

export default QUERIES
