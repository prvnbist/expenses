import gql from 'graphql-tag'

export const EARNINGS = gql`
   subscription earnings($limit: Int, $offset: Int) {
      earnings(limit: $limit, offset: $offset, order_by: { date: desc }) {
         id
         date
         amount
         source
         category
      }
   }
`

export const EXPENSES = gql`
   subscription expenses(
      $limit: Int
      $offset: Int
      $order_by: [expenses_order_by!]
      $where: expenses_bool_exp = {}
   ) {
      expenses(
         limit: $limit
         offset: $offset
         order_by: $order_by
         where: $where
      ) {
         id
         date
         title
         amount
         category
         payment_method
      }
   }
`

export const PAYMENT_METHODS = gql`
   subscription payment_methods {
      payment_methods {
         title
      }
   }
`

export const TOTAL_EARNINGS = gql`
   subscription total_earnings {
      total_earnings {
         aggregate {
            min {
               amount
            }
            max {
               amount
            }
            sum {
               amount
            }
            count
            avg {
               amount
            }
         }
      }
   }
`

export const TOTAL_EXPENSES = gql`
   subscription total_expenses($where: expenses_bool_exp = {}) {
      total_expenses(where: $where) {
         aggregate {
            min {
               amount
            }
            max {
               amount
            }
            sum {
               amount
            }
            count
            avg {
               amount
            }
         }
      }
   }
`

export const EARNING_SOURCES = gql`
   subscription earning_sources {
      earning_sources {
         id
         title
      }
   }
`

export const EXPENSES_CATEGORIES = gql`
   subscription expense_categories {
      expense_categories {
         id
         title
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

export const SUM_BY_CATEGORIES = gql`
   subscription sumByCategory {
      sumByCategory: sum_by_category_aggregate(order_by: { amount: desc }) {
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

export const SUM_BY_MONTH = gql`
   subscription sumByMonth {
      sumByMonth: sum_by_month_aggregate(order_by: { month: asc }) {
         aggregate {
            count
            sum {
               amount
            }
         }
         nodes {
            title
            amount
            count
         }
      }
   }
`

export const SUM_BY_YEAR = gql`
   subscription sumByYear {
      sumByYear: sum_by_year_aggregate(order_by: { year: desc }) {
         aggregate {
            count
            sum {
               amount
            }
         }
         nodes {
            year
            amount
            count
         }
      }
   }
`
