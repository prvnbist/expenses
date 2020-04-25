import gql from 'graphql-tag'

export const DELETE_EARNINGS = gql`
   mutation delete_earnings($where: earnings_bool_exp!) {
      delete_earnings(where: $where) {
         returning {
            id
            source
         }
      }
   }
`
