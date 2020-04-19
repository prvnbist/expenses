import gql from 'graphql-tag'

export const TOTAL_EARNINGS = gql`
   query total_earnings {
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
