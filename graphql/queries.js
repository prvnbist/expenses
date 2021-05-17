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
      $where: transactions_view_bool_exp = {}
      $order_by: [transactions_view_order_by!] = {}
   ) {
      transactions: transactions_view(
         where: $where
         order_by: $order_by
         limit: $limit
         offset: $offset
      ) {
         id
         type
         date
         title
         debit
         credit
         amount
         account
         raw_date
         account_id
         category
         category_id
         payment_method
         payment_method_id
      }
   }
`

export const TRANSACTIONS_AGGREGATE = gql`
   subscription transactions_aggregate(
      $where: transactions_view_bool_exp = {}
   ) {
      transactions_aggregate: transactions_view_aggregate(where: $where) {
         aggregate {
            count
            sum {
               credit
               debit
            }
            avg {
               credit
               debit
            }
            max {
               credit
               debit
            }
         }
      }
   }
`

export const EXPENSES_BY_CATEGORIES = gql`
   subscription expenses_by_categories {
      expenses_by_categories: analytics_expenses_by_category_aggregate(
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
      expenses_by_years: analytics_expenses_by_year_aggregate(
         order_by: { title: desc }
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

export const EXPENSES_BY_MONTHS = gql`
   subscription expenses_by_months {
      expenses_by_months: analytics_expenses_by_month_aggregate(
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
      incomes_by_months: analytics_incomes_by_month_aggregate(
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

export const INCOMES_BY_CATEGORIES = gql`
   subscription incomes_by_categories {
      incomes_by_categories: analytics_incomes_by_category_aggregate(
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
      incomes_by_years: analytics_incomes_by_year_aggregate(
         order_by: { title: desc }
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

export const ACCOUNTS = gql`
   subscription accounts {
      accounts(order_by: { title: asc }) {
         id
         title
         expense_count
         expense_sum
         income_count
         income_sum
      }
   }
`

export const MONTHLY_EXPENSE_REPORT = gql`
   subscription monthly_expense_report(
      $where: analytics_monthly_expense_report_bool_exp = {}
      $order_by: [analytics_monthly_expense_report_order_by!] = {}
   ) {
      monthly_expense_report: analytics_monthly_expense_report(
         where: $where
         order_by: $order_by
      ) {
         month
         year
         title
         count
         amount
      }
   }
`

export const MONTHLY_INCOME_REPORT = gql`
   subscription monthly_income_report(
      $where: analytics_monthly_income_report_bool_exp = {}
      $order_by: [analytics_monthly_income_report_order_by!] = {}
   ) {
      monthly_income_report: analytics_monthly_income_report(
         where: $where
         order_by: $order_by
      ) {
         month
         year
         title
         count
         amount
      }
   }
`

export const EXPENSE_YEARS = gql`
   query expense_years_list {
      expense_years_list: analytics_expense_years_list(
         order_by: { year: desc }
      ) {
         year
      }
   }
`

export const INCOME_YEARS = gql`
   query income_years_list {
      income_years_list: analytics_income_years_list(order_by: { year: desc }) {
         year
      }
   }
`
