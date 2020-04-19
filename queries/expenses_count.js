import gql from 'graphql-tag'

export const EXPENSES_COUNT = gql`
   query total_expenses {
      total_expenses {
         aggregate {
            count
         }
      }
   }
`
