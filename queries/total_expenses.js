import gql from 'graphql-tag'

export const TOTAL_EXPENSES = gql`
   subscription total_expenses {
      total_expenses {
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
