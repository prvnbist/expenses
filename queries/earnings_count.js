import gql from 'graphql-tag'

export const EARNINGS_COUNT = gql`
   query total_earnings {
      total_earnings {
         aggregate {
            count
         }
      }
   }
`
