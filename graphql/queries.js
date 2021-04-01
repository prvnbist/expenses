import { gql } from '@apollo/client'

export const OVERALL = gql`
   query overall {
      overall {
         title
         amount
      }
   }
`

export const SETTINGS = gql`
   subscription settings {
      settings {
         id
         type
         value
      }
   }
`

export const CATEGORIES = gql`
   subscription categories {
      categories(order_by: { title: asc }) {
         id
         type
         title
      }
   }
`

export const PAYMENT_METHODS = gql`
   subscription payment_methods {
      payment_methods(order_by: { title: asc }) {
         id
         title
      }
   }
`

export const TRANSACTIONS = gql`
   subscription transactions(
      $limit: Int = 10
      $offset: Int = 0
      $where: transactions_bool_exp = {}
      $order_by: [transactions_order_by!] = {}
   ) {
      transactions(
         where: $where
         order_by: $order_by
         limit: $limit
         offset: $offset
      ) {
         id
         date
         type
         title
         amount
         account_id
         account {
            id
            title
         }
         category_id
         category {
            id
            title
         }
         payment_method_id
         payment_method {
            id
            title
         }
      }
   }
`

export const TRANSACTIONS_AGGREGATE = gql`
   subscription transactions_aggregate {
      transactions_aggregate {
         aggregate {
            count
         }
      }
   }
`

export const EXPENSES_BY_CATEGORIES = gql`
   subscription expenses_by_categories {
      expenses_by_categories: expenses_by_category_aggregate(
         order_by: { amount: desc }
      ) {
         aggregate {
            count
            sum {
               amount
            }
         }
         nodes {
            title
            count
            amount
         }
      }
   }
`

export const EXPENSES_BY_YEARS = gql`
   subscription expenses_by_years {
      expenses_by_years: expenses_by_year_aggregate(order_by: { year: desc }) {
         aggregate {
            count
            sum {
               amount
            }
         }
         nodes {
            year
            count
            amount
         }
      }
   }
`

export const EXPENSES_BY_MONTHS = gql`
   subscription expenses_by_months {
      expenses_by_months: expenses_by_month_aggregate(
         order_by: { month: asc }
      ) {
         aggregate {
            count
            sum {
               amount
            }
         }
         nodes {
            title
            count
            amount
         }
      }
   }
`

export const INCOMES_BY_MONTHS = gql`
   subscription incomes_by_months {
      incomes_by_months: incomes_by_month_aggregate(order_by: { month: asc }) {
         aggregate {
            count
            sum {
               amount
            }
         }
         nodes {
            title
            count
            amount
         }
      }
   }
`

export const INCOMES_BY_CATEGORIES = gql`
   subscription incomes_by_categories {
      incomes_by_categories: incomes_by_category_aggregate(
         order_by: { amount: desc }
      ) {
         aggregate {
            count
            sum {
               amount
            }
         }
         nodes {
            title
            count
            amount
         }
      }
   }
`

export const INCOMES_BY_YEARS = gql`
   subscription incomes_by_years {
      incomes_by_years: incomes_by_year_aggregate(order_by: { year: desc }) {
         aggregate {
            count
            sum {
               amount
            }
         }
         nodes {
            year
            count
            amount
         }
      }
   }
`

export const ACCOUNTS = gql`
   subscription accounts {
      accounts {
         id
         title
      }
   }
`
