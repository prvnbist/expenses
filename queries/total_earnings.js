import gql from 'graphql-tag'

export const TOTAL_EARNINGS = gql`
   query total_earnings {
      total_earnings {
         aggregate {
            sum {
               amount
            }
         }
      }
   }
`
