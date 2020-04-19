import gql from 'graphql-tag'

export const TOTAL_EXPENSES = gql`
   query total_expenses {
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
